package main

import (
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
	app := pocketbase.New()

	// ------------------------------------------------------------
	// HOOK: New User Initialization
	// ------------------------------------------------------------
	app.OnRecordCreate("users").BindFunc(func(e *core.RecordEvent) error {
		// --- THIS CODE RUNS BEFORE SAVING (MODIFICATION PHASE) ---

		// 1. Generate unique referral code
		for {
			code := generateRandomString(6)
			existing, _ := app.FindFirstRecordByFilter("users", "referral_code = {:code}", map[string]any{"code": code})
			if existing == nil {
				e.Record.Set("referral_code", code)
				break
			}
		}

		// 2. Default values
		e.Record.Set("coins", 100)
		e.Record.Set("daily_spins_left", 3)
		e.Record.Set("daily_streak", 0)
		e.Record.Set("level", 1)
		e.Record.Set("last_spin_date", time.Now().UTC().AddDate(0, 0, -1))

		if e.Record.GetString("avatar_url") == "" {
			username := e.Record.GetString("username")
			e.Record.Set("avatar_url", "https://api.dicebear.com/9.x/avataaars/png?seed="+username)
		}

		// --------------------------------------------------------
		return e.Next() // This saves the record to the DB
		// --------------------------------------------------------
	})

	// ------------------------------------------------------------
	// CUSTOM ROUTES
	// ------------------------------------------------------------
	app.OnServe().BindFunc(func(e *core.ServeEvent) error {
		// seed functio
		if err := seedDatabase(app); err != nil {
			log.Println("Seed error:", err)
		}

		// 1. ROUTE: Play Lucky Spin
		e.Router.POST("/api/play-lucky-spin", func(re *core.RequestEvent) error {
			// In v0.23, the auth record is directly on the event
			authRecord := re.Auth
			if authRecord == nil {
				return apis.NewUnauthorizedError("Unauthenticated", nil)
			}

			now := time.Now().UTC()
			lastSpinDate := authRecord.GetDateTime("last_spin_date").Time().UTC()

			if lastSpinDate.Format("2006-01-02") != now.Format("2006-01-02") {
				authRecord.Set("daily_spins_left", 3)
			}

			spinsLeft := authRecord.GetInt("daily_spins_left")
			if spinsLeft <= 0 {
				return re.JSON(http.StatusOK, map[string]any{
					"success": false,
					"message": "No spins left for today!",
				})
			}

			// Weighted Random Selection
			prizes, err := app.FindRecordsByFilter("spin_wheel_prizes", "1=1", "id", 100, 0)
			if err != nil {
				return err
			}

			var selectedPrize *core.Record
			randVal := rand.Intn(100) + 1
			cumulative := 0
			for _, p := range prizes {
				cumulative += p.GetInt("probability")
				if randVal <= cumulative {
					selectedPrize = p
					break
				}
			}

			if selectedPrize == nil && len(prizes) > 0 {
				selectedPrize = prizes[0]
			}

			reward := selectedPrize.GetInt("value")
			authRecord.Set("daily_spins_left", spinsLeft-1)
			authRecord.Set("coins", authRecord.GetInt("coins")+reward)
			authRecord.Set("last_spin_date", now)

			if err := app.Save(authRecord); err != nil {
				return err
			}

			return re.JSON(http.StatusOK, map[string]any{
				"success":    true,
				"reward":     reward,
				"spins_left": authRecord.GetInt("daily_spins_left"),
				"index":      selectedPrize.GetInt("id"),
			})
		})

		// 2. ROUTE: Claim Daily Reward
		e.Router.POST("/api/claim-daily-reward", func(re *core.RequestEvent) error {
			// SECURITY CHECK: This replaces apis.RequireAuth() manually
			authRecord := re.Auth
			if authRecord == nil {
				return apis.NewUnauthorizedError("Unauthenticated", nil)
			}

			// 1. Force current time to UTC
			now := time.Now().UTC()
			todayStr := now.Format("2006-01-02")
			yesterdayStr := now.AddDate(0, 0, -1).Format("2006-01-02")

			// 2. Ensure database time is also evaluated in UTC
			lastCheckInTime := authRecord.GetDateTime("last_check_in").Time().UTC()
			lastCheckInStr := lastCheckInTime.Format("2006-01-02")

			// 3. Check if user already claimed today
			// If lastCheckInStr is "0001-01-01", it means they never checked in
			if lastCheckInStr == todayStr {
				return re.JSON(http.StatusOK, map[string]any{
					"success": false,
					"message": "Already claimed today!",
				})
			}

			// 4. Calculate the new streak
			newStreak := 1
			// If they checked in yesterday, increment the streak.
			if lastCheckInStr == yesterdayStr {
				newStreak = authRecord.GetInt("daily_streak") + 1
			}

			// 5. Look up the reward amount based on the cycle (Day 1-7)
			cycleDay := ((newStreak - 1) % 7) + 1
			rewardAmount := 50 // Default fallback

			config, err := app.FindFirstRecordByFilter(
				"daily_rewards_config",
				"day_number = {:day}",
				map[string]any{"day": cycleDay},
			)

			if err == nil && config != nil {
				rewardAmount = config.GetInt("reward_amount")
			}

			// 6. Update the User record
			authRecord.Set("daily_streak", newStreak)
			authRecord.Set("last_check_in", now)
			authRecord.Set("coins", authRecord.GetInt("coins")+rewardAmount)

			// Save the changes back to the database
			if err := app.Save(authRecord); err != nil {
				return apis.NewBadRequestError("Failed to update check-in data", err)
			}

			// NEW: Return the updated authRecord (user) in the response
			return re.JSON(http.StatusOK, map[string]any{
				"success":    true,
				"reward":     rewardAmount,
				"new_streak": newStreak,
				"user":       authRecord, // Add this line
			})
		})

		// 3. ROUTE: Add Spin (Ad Reward)
		e.Router.POST("/api/add-one-spin", func(re *core.RequestEvent) error {
			authRecord := re.Auth
			if authRecord == nil {
				return apis.NewUnauthorizedError("Unauthenticated", nil)
			}

			authRecord.Set("daily_spins_left", authRecord.GetInt("daily_spins_left")+1)
			if err := app.Save(authRecord); err != nil {
				return err
			}

			return re.JSON(http.StatusOK, map[string]any{"success": true})
		})

		e.Router.GET("/api/leaderboard", func(re *core.RequestEvent) error {
			// 1. Get Top 50 Users sorted by coins
			// Note: Use "coins" as the sorting field.
			// We use -coins for descending order.
			records, err := app.FindRecordsByFilter("users", "1=1", "-coins", 50, 0)
			if err != nil {
				return apis.NewBadRequestError("Failed to fetch leaderboard", err)
			}

			type LeaderboardItem struct {
				ID       string `json:"id"`
				Username string `json:"username"`
				Avatar   string `json:"avatar"`
				Coins    int    `json:"coins"`
				Rank     int    `json:"rank"`
			}

			var leaderboard []LeaderboardItem
			for i, rec := range records {
				leaderboard = append(leaderboard, LeaderboardItem{
					ID:       rec.Id,
					Username: rec.GetString("username"),
					Avatar:   rec.GetString("avatar"),
					Coins:    rec.GetInt("coins"),
					Rank:     i + 1,
				})
			}

			// 2. Logic for the current user's rank (if they aren't in the top 50)
			var userRank int
			authRecord := re.Auth
			if authRecord != nil {
				userCoins := authRecord.GetInt("coins")

				// SQL trick to get rank: count how many users have more coins than me + 1
				var count int
				err := app.DB().
					Select("count(*)").
					From("users").
					Where(dbx.NewExp("coins > {:coins}", dbx.Params{"coins": userCoins})).
					Row(&count)

				if err == nil {
					userRank = count + 1
				}
			}

			return re.JSON(http.StatusOK, map[string]any{
				"leaderboard": leaderboard,
				"user_rank":   userRank,
			})
		})

		return e.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

func generateRandomString(n int) string {
	var letters = []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	s := make([]rune, n)
	for i := range s {
		s[i] = letters[rand.Intn(len(letters))]
	}
	return string(s)
}
