package main

import (
	"log"

	"github.com/pocketbase/pocketbase/core"
)

func seedDatabase(app core.App) error {
	// 1. GAMES
	gamesCollection, err := app.FindCollectionByNameOrId("games")
	if err != nil {
		log.Println("Skipping Games seed: collection 'games' does not exist in Admin UI")
	} else if isCollectionEmpty(app, "games") {
		games := []map[string]any{
			{
				"title":       "Slope",
				"url":         "https://html5.gamedistribution.com/39322238374d47479712165181177656/",
				"image":       "https://img.gamedistribution.com/39322238374d47479712165181177656-512x512.jpeg",
				"orientation": "landscape",
				"category":    "Action",
				"description": "Drive your ball through a high-speed 3D tunnel. Avoid obstacles!",
				"is_active":   true,
			},
			{
				"title":       "Moto X3M",
				"url":         "https://html5.gamedistribution.com/28481498a9fa4353a2a68897f2613d05/",
				"image":       "https://img.gamedistribution.com/28481498a9fa4353a2a68897f2613d05-512x512.jpeg",
				"orientation": "landscape",
				"category":    "Racing",
				"description": "Perform stunts and beat the clock in this bike racing game.",
				"is_active":   true,
			},
			{
				"title":       "Subway Runner",
				"url":         "https://html5.gamedistribution.com/6990521e251147a78122606830f30c9d/",
				"image":       "https://img.gamedistribution.com/6990521e251147a78122606830f30c9d-512x512.jpeg",
				"orientation": "portrait",
				"category":    "Action",
				"description": "Run as fast as you can through the subway tracks.",
				"is_active":   true,
			},
			{
				"title":       "Ludo Legend",
				"url":         "https://html5.gamedistribution.com/366e51c8651c4e7ab1b8f522858b760a/",
				"image":       "https://img.gamedistribution.com/366e51c8651c4e7ab1b8f522858b760a-512x512.jpeg",
				"orientation": "landscape",
				"category":    "Casual",
				"description": "The classic board game Ludo, now on your phone.",
				"is_active":   true,
			},
			{
				"title":       "Candy Riddles",
				"url":         "https://html5.gamedistribution.com/5650117079f4492694b407ec14b40108/",
				"image":       "https://img.gamedistribution.com/5650117079f4492694b407ec14b40108-512x512.jpeg",
				"orientation": "portrait",
				"category":    "Puzzle",
				"description": "Match candies in this sweet puzzle adventure.",
				"is_active":   true,
			},
			{
				"title":       "Penalty Shooters 2",
				"url":         "https://html5.gamedistribution.com/5f72005047b84f3388a994784e1b731e/",
				"image":       "https://img.gamedistribution.com/5f72005047b84f3388a994784e1b731e-512x512.jpeg",
				"orientation": "landscape",
				"category":    "Sports",
				"description": "Choose your team and win the soccer championship.",
				"is_active":   true,
			},
			{
				"title":       "8 Ball Pool",
				"url":         "https://html5.gamedistribution.com/6c2049e2501140088012606830f30c9d/",
				"image":       "https://img.gamedistribution.com/6c2049e2501140088012606830f30c9d-512x512.jpeg",
				"orientation": "landscape",
				"category":    "Sports",
				"description": "Standard 8-ball billiards game.",
				"is_active":   true,
			},
			{
				"title":       "Tomb Runner",
				"url":         "https://html5.gamedistribution.com/a42b1f8f307f4337910830f30c9d6905/",
				"image":       "https://img.gamedistribution.com/a42b1f8f307f4337910830f30c9d6905-512x512.jpeg",
				"orientation": "portrait",
				"category":    "Action",
				"description": "Sprint through the tomb, jumping and sliding to survive.",
				"is_active":   true,
			},
			{
				"title":       "Drift Cup Racing",
				"url":         "https://html5.gamedistribution.com/00139965d8364835848606830f30c9d6/",
				"image":       "https://img.gamedistribution.com/00139965d8364835848606830f30c9d6-512x512.jpeg",
				"orientation": "landscape",
				"category":    "Racing",
				"description": "Top-down racing where drifting is the key to victory.",
				"is_active":   true,
			},
			{
				"title":       "Onet Connect Classic",
				"url":         "https://html5.gamedistribution.com/59322238374d47479712165181177656/",
				"image":       "https://img.gamedistribution.com/59322238374d47479712165181177656-512x512.jpeg",
				"orientation": "portrait",
				"category":    "Puzzle",
				"description": "Link pairs of tiles to clear the board.",
				"is_active":   true,
			},
		}

		for _, g := range games {
			record := core.NewRecord(gamesCollection)
			record.Load(g)
			if err := app.Save(record); err != nil {
				log.Printf("ERROR saving game %s: %v", g["title"], err)
			}
		}
		log.Println("✅ Seeded 10 high-quality games from GameDistribution")
	}

	// ... rest of function

	// 2. DAILY REWARDS
	rewardCollection, err := app.FindCollectionByNameOrId("daily_rewards_config")
	if err != nil {
		log.Println("Skipping Reward seed: collection 'daily_rewards_config' does not exist")
	} else if isCollectionEmpty(app, "daily_rewards_config") {
		rewards := []map[string]any{
			{"day_number": 1, "reward_amount": 50},
			{"day_number": 2, "reward_amount": 75},
			{"day_number": 3, "reward_amount": 100},
			{"day_number": 4, "reward_amount": 125},
			{"day_number": 5, "reward_amount": 150},
			{"day_number": 6, "reward_amount": 200},
			{"day_number": 7, "reward_amount": 500},
		}
		for _, r := range rewards {
			record := core.NewRecord(rewardCollection)
			record.Load(r)
			if err := app.Save(record); err != nil {
				log.Printf("ERROR saving reward day %d: %v", r["day_number"], err)
			}
		}
		log.Println("✅ Seeded daily rewards")
	}

	// 3. SPIN PRIZES
	prizesCollection, err := app.FindCollectionByNameOrId("spin_wheel_prizes")
	if err != nil {
		log.Println("Skipping Prizes seed: collection 'spin_wheel_prizes' does not exist")
	} else if isCollectionEmpty(app, "spin_wheel_prizes") {
		prizes := []map[string]any{
			{"label": "20", "value": 20, "probability": 30},
			{"label": "50", "value": 50, "probability": 25},
			{"label": "100", "value": 100, "probability": 20},
			{"label": "200", "value": 200, "probability": 10},
			{"label": "500", "value": 500, "probability": 5},
			{"label": "1K", "value": 1000, "probability": 2},
			{"label": "Ticket", "value": 50, "probability": 8},
			{"label": "JACKPOT", "value": 5000, "probability": 0},
		}
		for _, p := range prizes {
			record := core.NewRecord(prizesCollection)
			record.Load(p)
			if err := app.Save(record); err != nil {
				log.Printf("ERROR saving prize %s: %v", p["label"], err)
			}
		}
		log.Println("✅ Seeded spin prizes")
	}

	return nil
}

func isCollectionEmpty(app core.App, collectionName string) bool {
	count, err := app.CountRecords(collectionName)
	return err == nil && count == 0
}
