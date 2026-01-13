package models

type ListAllParams struct {
	Limit   int32  `query:"limit" doc:"elements max length"`
	Cursor  string `query:"cursor" doc:"pagination token"`
	Mission string `dynamodbav:"mission_name" query:"mission" doc:"record mission field name"`
	Year    string `dynamodbav:"launch_date_utc" query:"year"`
}

func (p *ListAllParams) HasFilters() bool {
	return p.Mission != "" || p.Year != ""
}
