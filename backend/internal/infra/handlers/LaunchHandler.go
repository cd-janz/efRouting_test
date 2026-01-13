package handlers

import (
	"context"
	"fmt"
	"spacex_analytics/internal/app/services"
	"spacex_analytics/internal/infra/dto"
	"spacex_analytics/internal/infra/entities"
	"spacex_analytics/internal/infra/models"
)

type LaunchHandler struct {
	svc *services.LaunchService
}

func NewLaunchHandler(svc *services.LaunchService) *LaunchHandler {
	return &LaunchHandler{svc: svc}
}

func (hdl *LaunchHandler) GetLaunchList(ctx context.Context, input *models.ListAllParams) (*models.Response[[]entities.LaunchEntity], error) {
	fmt.Printf("object: %+v\n", *input)
	res, cursor, err := hdl.svc.GetLaunchList(ctx, input)
	if err != nil {
		return nil, err
	}
	message := "Success: Data processed"
	return models.NewResponse[[]entities.LaunchEntity](message).AddMeta("cursor", cursor).SetData(&res), nil
}

func (hdl *LaunchHandler) GetSuccessRate(ctx context.Context, input *struct{}) (*models.Response[dto.SuccessRateDTO], error) {
	return nil, nil
}

func (hdl *LaunchHandler) GetUpcomingRate(ctx context.Context, input *struct{}) (*models.Response[dto.UpcomingRateDTO], error) {
	return nil, nil
}
