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
				"title":       "Om Nom Run",
				"url":         "https://play.famobi.com/om-nom-run",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/OmNomRunMain.jpg",
				"orientation": "portrait",
				"category":    "Action",
				"description": "Run through the streets of Nomville, avoid obstacles, and use power-ups to clear the way with Om Nom!",
				"is_active":   true,
			},
			{
				"title":       "Smarty Bubbles",
				"url":         "https://play.famobi.com/smarty-bubbles",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/SmartyBubblesMain.jpg",
				"orientation": "portrait",
				"category":    "Puzzle",
				"description": "One of the world's most popular bubble shooters. Combine 3 bubbles to clear the board.",
				"is_active":   true,
			},
			{
				"title":       "Table Tennis World Tour",
				"url":         "https://play.famobi.com/table-tennis-world-tour",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/TableTennisWorldTourMain.jpg",
				"orientation": "landscape",
				"category":    "Sports",
				"description": "Become a paddle master in this 3D ping pong game with realistic physics and global tournaments.",
				"is_active":   true,
			},
			{
				"title":       "Bubble Woods",
				"url":         "https://play.famobi.com/bubble-woods",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/BubbleWoodsMain.jpg",
				"orientation": "portrait",
				"category":    "Puzzle",
				"description": "A fast-paced bubble shooter set in a magical forest. Help the squirrel clear bubbles in 60 seconds!",
				"is_active":   true,
			},
			{
				"title":       "Archery World Tour",
				"url":         "https://play.famobi.com/archery-world-tour",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/ArcheryWorldTourMain.jpg",
				"orientation": "portrait",
				"category":    "Sports",
				"description": "Test your precision in various environments. Aim for the bullseye and account for wind speed.",
				"is_active":   true,
			},
			{
				"title":       "Solitaire Classic",
				"url":         "https://play.famobi.com/solitaire-classic",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/SolitaireClassicMain.jpg",
				"orientation": "portrait",
				"category":    "Cards",
				"description": "The timeless Klondike Solitaire experience optimized for mobile play.",
				"is_active":   true,
			},
			{
				"title":       "Color Tunnel",
				"url":         "https://play.famobi.com/color-tunnel",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/ColorTunnelMain.jpg",
				"orientation": "landscape",
				"category":    "Arcade",
				"description": "A high-speed adrenaline rush. Dodge obstacles in a constantly changing colorful tunnel.",
				"is_active":   true,
			},
			{
				"title":       "8 Ball Billiards Classic",
				"url":         "https://play.famobi.com/8-ball-billiards-classic",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/8BallBilliardsClassicMain.jpg",
				"orientation": "landscape",
				"category":    "Sports",
				"description": "Play against a friend or the CPU in this polished, classic pool simulator.",
				"is_active":   true,
			},
			{
				"title":       "Zoo Boom",
				"url":         "https://play.famobi.com/zoo-boom",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/ZooBoomMain.jpg",
				"orientation": "portrait",
				"category":    "Match 3",
				"description": "Cute animal-themed match-3 game. Tap identical animals to collect them and complete levels.",
				"is_active":   true,
			},
			{
				"title":       "Garden Bloom",
				"url":         "https://play.famobi.com/garden-bloom",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/GardenBloomMain.jpg",
				"orientation": "portrait",
				"category":    "Match 3",
				"description": "Create a beautiful garden by matching flowers and clearing over 2000 challenging levels.",
				"is_active":   true,
			},
			{
				"title":       "Butterfly Shimai",
				"url":         "https://play.famobi.com/butterfly-shimai",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/ButterflyShimaiMain.jpg",
				"orientation": "portrait",
				"category":    "Mahjong",
				"description": "A beautiful mahjong connect game where you link pairs of butterfly wings to set them free.",
				"is_active":   true,
			},
			{
				"title":       "Neon Tower",
				"url":         "https://play.famobi.com/neon-tower",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/NeonTowerMain.jpg",
				"orientation": "portrait",
				"category":    "Action",
				"description": "Reach the bottom of the neon tower in this addictive arcade helix jump game.",
				"is_active":   true,
			},
			{
				"title":       "Fruita Crush",
				"url":         "https://play.famobi.com/fruita-crush",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/FruitaCrushMain.jpg",
				"orientation": "portrait",
				"category":    "Match 3",
				"description": "A classic fruit-matching adventure with power-ups and hundreds of levels.",
				"is_active":   true,
			},
			{
				"title":       "Jewelish",
				"url":         "https://play.famobi.com/jewelish",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/JewelishMain.jpg",
				"orientation": "portrait",
				"category":    "Match 3",
				"description": "Match shiny jewels in this 2-minute high-score challenge.",
				"is_active":   true,
			},
			{
				"title":       "Chess Classic",
				"url":         "https://play.famobi.com/chess-classic",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/ChessClassicMain.jpg",
				"orientation": "portrait",
				"category":    "Board",
				"description": "Improve your skills and beat the computer in this clean, professional chess game.",
				"is_active":   true,
			},
			{
				"title":       "Backgammon Classic",
				"url":         "https://play.famobi.com/backgammon-classic",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/BackgammonClassicMain.jpg",
				"orientation": "landscape",
				"category":    "Board",
				"description": "Play one of the oldest board games in the world with smooth animations and fair dice.",
				"is_active":   true,
			},
			{
				"title":       "Penalty Cup 2021",
				"url":         "https://play.famobi.com/penalty-cup-2021",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/PenaltyCup2021Main.jpg",
				"orientation": "portrait",
				"category":    "Sports",
				"description": "Select your team and win the trophy in this high-stakes penalty shootout game.",
				"is_active":   true,
			},
			{
				"title":       "Endless Truck",
				"url":         "https://play.famobi.com/endless-truck",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/EndlessTruckMain.jpg",
				"orientation": "landscape",
				"category":    "Racing",
				"description": "Race your monster truck, perform stunts, and upgrade your vehicle to go the distance.",
				"is_active":   true,
			},
			{
				"title":       "Kebab World",
				"url":         "https://play.famobi.com/kebab-world",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/KebabWorldMain.jpg",
				"orientation": "portrait",
				"category":    "Casual",
				"description": "Run your own restaurant and serve hungry customers in this fast-paced cooking sim.",
				"is_active":   true,
			},
			{
				"title":       "Cannon Balls 3D",
				"url":         "https://play.famobi.com/cannon-balls-3d",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/CannonBalls3DMain.jpg",
				"orientation": "portrait",
				"category":    "Puzzle",
				"description": "Destroy towers with a limited number of cannonballs in this satisfying physics game.",
				"is_active":   true,
			},
			{
				"title":       "Diamond Rush Classic",
				"url":         "https://play.famobi.com/diamond-rush-classic",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/DiamondRushClassicMain.jpg",
				"orientation": "portrait",
				"category":    "Puzzle",
				"description": "Dig deep, collect diamonds, and avoid traps in this retro-style adventure.",
				"is_active":   true,
			},
			{
				"title":       "Soccer Heads",
				"url":         "https://play.famobi.com/soccer-heads",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/SoccerHeadsMain.jpg",
				"orientation": "landscape",
				"category":    "Sports",
				"description": "A fun 1v1 football game where players with giant heads compete for the ball.",
				"is_active":   true,
			},
			{
				"title":       "Gin Rummy Plus",
				"url":         "https://play.famobi.com/gin-rummy-plus",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/GinRummyPlusMain.jpg",
				"orientation": "landscape",
				"category":    "Cards",
				"description": "The classic card game with a sleek interface and smart AI opponents.",
				"is_active":   true,
			},
			{
				"title":       "Onet Mahjong Connect",
				"url":         "https://play.famobi.com/onet-mahjong-connect",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/OnetMahjongConnectMain.jpg",
				"orientation": "portrait",
				"category":    "Mahjong",
				"description": "Connect identical mahjong tiles with a path to clear the level.",
				"is_active":   true,
			},
			{
				"title":       "3D Darts",
				"url":         "https://play.famobi.com/3d-darts",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/3DDartsMain.jpg",
				"orientation": "portrait",
				"category":    "Sports",
				"description": "Realistic 3D darts physics. Play 501, 301, or Cricket against the computer.",
				"is_active":   true,
			},
			{
				"title":       "Fidget Spinner Highscore",
				"url":         "https://play.famobi.com/fidget-spinner-highscore",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/FidgetSpinnerHighscoreMain.jpg",
				"orientation": "portrait",
				"category":    "Casual",
				"description": "Spin the fidget spinner as fast as you can to earn coins and unlock upgrades.",
				"is_active":   true,
			},
			{
				"title":       "Mafia Poker",
				"url":         "https://play.famobi.com/mafia-poker",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/MafiaPokerMain.jpg",
				"orientation": "landscape",
				"category":    "Cards",
				"description": "Texas Hold'em with a mafia theme. Bluff your way to the top of the underworld.",
				"is_active":   true,
			},
			{
				"title":       "Speed Master",
				"url":         "https://play.famobi.com/speed-master",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/SpeedMasterMain.jpg",
				"orientation": "portrait",
				"category":    "Racing",
				"description": "One-tap racing game. Control your speed to avoid crashes on busy highways.",
				"is_active":   true,
			},
			{
				"title":       "Neon Rider",
				"url":         "https://play.famobi.com/neon-rider",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/NeonRiderMain.jpg",
				"orientation": "landscape",
				"category":    "Racing",
				"description": "Drive your neon bike through futuristic tracks and perform flips for points.",
				"is_active":   true,
			},
			{
				"title":       "Drift Dudes",
				"url":         "https://play.famobi.com/drift-dudes",
				"image":       "https://img.famobi.com/portal/html5games/images/tmp/DriftDudesMain.jpg",
				"orientation": "landscape",
				"category":    "Racing",
				"description": "Compete in multiplayer races and drift around corners to win.",
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
