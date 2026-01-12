package main

import (
	"os"
	"spacex_analytics/internal/infra/config"
	"spacex_analytics/internal/infra/entities"
	"spacex_analytics/internal/infra/repository"
	"spacex_analytics/internal/infra/routes"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humaecho"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

func main() {
	e := echo.New()
	defer e.Close()
	err := godotenv.Load()
	if err != nil {
		log.Infof("Error loading .env file")
	}
	humaConfig := huma.DefaultConfig("efRouting", "0.0.1")
	humaConfig.DocsPath = "/docs"
	api := humaecho.New(e, humaConfig)
	apiV1 := huma.NewGroup(api, "/api/v1")
	table := os.Getenv("TABLE_NAME")
	dyDB := config.NewDynamoDB[entities.LaunchEntity](table)
	dyRepo := repository.NewDynamoLaunchRepository(dyDB)
	routes.RegisterLaunchRoutes(apiV1, dyRepo)
	e.Logger.Fatal(e.Start(":1323"))
}
