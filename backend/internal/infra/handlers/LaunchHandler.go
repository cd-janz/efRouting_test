package handlers

import (
	"context"
	"spacex_analytics/internal/app/services"
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
	var limit *int32
	var cursor *string
	if input.Limit != 0 {
		limit = &input.Limit
	}
	if input.Cursor != "" {
		cursor = &input.Cursor
	}
	res, cursor, err := hdl.svc.GetLaunchList(ctx, cursor, limit)
	if err != nil {
		return nil, err
	}
	message := "Success: Data processed"
	return models.NewResponse[[]entities.LaunchEntity](message).AddMeta("cursor", cursor).SetData(&res), nil
}
