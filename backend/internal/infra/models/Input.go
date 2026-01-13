package models

type ListAllParams struct {
	Limit   int32  `query:"limit" doc:"elements max length"`
	Cursor  string `query:"cursor" doc:"pagination token"`
	Mission string `dynamodbav:"mission_name" query:"mission" doc:"record mission field name"`
}

func (p *ListAllParams) HasFilters() bool {
	return p.Mission != ""
}

type StartWithParam struct {
	Mission string `query:"mission"`
}
