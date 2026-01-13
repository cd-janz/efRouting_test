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
	huma.Register(group, huma.Operation{
		Method:  http.MethodGet,
		Path:    "/success",
		Tags:    []string{"GET", "graphics"},
		Summary: "Get success launch rate",
	}, hdl.GetSuccessRate)
	huma.Register(group, huma.Operation{
		Method:  http.MethodGet,
		Path:    "/upcoming",
		Tags:    []string{"GET", "graphics"},
		Summary: "Get upcoming launches rate",
	}, hdl.GetUpcomingRate)
	huma.Register(group, huma.Operation{
		Method:  http.MethodGet,
		Path:    "/year-rate",
		Tags:    []string{"GET", "graphics"},
		Summary: "Get by year launch rate",
	}, hdl.GetYearRate)
	huma.Register(group, huma.Operation{
		Method:  http.MethodGet,
		Path:    "/year-rate/full",
		Tags:    []string{"GET", "graphics"},
		Summary: "Get by year launch rate with full stats",
	}, hdl.GetFullStats)
}
