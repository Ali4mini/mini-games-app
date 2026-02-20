package main

import (
    "log"
    "github.com/pocketbase/pocketbase"
    "github.com/pocketbase/pocketbase/plugins/migratecmd"
    
    // CRITICAL: You must import your migrations folder 
    // using the module name from your go.mod file
    _ "mysteryplay-backend/migrations" 
)

func main() {
    app := pocketbase.New()

    // This registers the "migrate" command
    migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
        // If true, it will automatically run migrations on "serve"
        Automigrate: true, 
    })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}
