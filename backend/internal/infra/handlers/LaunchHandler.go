package handlers

import (
	"context"
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
	res, cursor, err := hdl.svc.GetLaunchList(ctx, input)
	if err != nil {
		return nil, err
	}
	message := "Success: Data processed"
	return models.NewResponse[[]entities.LaunchEntity](message).AddMeta("cursor", cursor).SetData(&res), nil
}

func (hdl *LaunchHandler) GetSuccessRate(ctx context.Context, input *struct{}) (*models.Response[dto.RateDTO], error) {
	res, err := hdl.svc.GetBooleanRate(ctx, "success", true)
	if err != nil {
		return nil, err
	}
	message := "Success: Data processed"
	return models.NewResponse[dto.RateDTO](message).SetData(res), nil
}

func (hdl *LaunchHandler) GetUpcomingRate(ctx context.Context, input *struct{}) (*models.Response[dto.RateDTO], error) {
	res, err := hdl.svc.GetBooleanRate(ctx, "upcoming", true)
	if err != nil {
		return nil, err
	}
	message := "Success: Data processed"
	return models.NewResponse[dto.RateDTO](message).SetData(res), nil
}
func (hdl *LaunchHandler) GetYearRate(ctx context.Context, input *struct{}) (*models.Response[[]dto.YearRateDTO], error) {
	res, err := hdl.svc.GetRateByYear(ctx)
	if err != nil {
		return nil, err
	}
	message := "Success: Data processed"
	return models.NewResponse[[]dto.YearRateDTO](message).SetData(&res), nil
}
func (hdl *LaunchHandler) GetFullStats(ctx context.Context, input *struct{}) (*models.Response[[]dto.YearFullRateDTO], error) {
	res, err := hdl.svc.GetWholeStatsByYear(ctx)
	if err != nil {
		return nil, err
	}
	message := "Success: Data processed"
	return models.NewResponse[[]dto.YearFullRateDTO](message).SetData(&res), nil
}
