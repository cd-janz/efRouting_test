package routes

import (
	"net/http"
	"spacex_analytics/internal/app/ports"
	"spacex_analytics/internal/app/services"
	"spacex_analytics/internal/infra/handlers"

	"github.com/danielgtaylor/huma/v2"
)

func RegisterLaunchRoutes(api huma.API, repo ports.LaunchRepository) {
	group := huma.NewGroup(api, "/launches")
	hdl := handlers.NewLaunchHandler(services.NewLaunchService(repo))
	huma.Register(group, huma.Operation{
		Method:  http.MethodGet,
		Path:    "/all",
		Tags:    []string{"GET", "launches"},
		Summary: "Get all registered launches",
	}, hdl.GetLaunchList)
}
