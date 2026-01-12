package models

type ListAllParams struct {
	Limit  int32  `query:"limit" doc:"Máximo de elementos"`
	Cursor string `query:"cursor" doc:"Token de paginación"`
}
