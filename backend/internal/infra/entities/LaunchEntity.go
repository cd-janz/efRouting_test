package entities

type LaunchEntity struct {
	ID       string  `dynamodbav:"launch_id" json:"launch_id"`
	Mission  string  `dynamodbav:"mission_name" json:"mission_name"`
	RocketID string  `dynamodbav:"rocket_id" json:"rocket_id"`
	Date     string  `dynamodbav:"launch_date" json:"launch_date"`
	Success  bool    `dynamodbav:"success"`
	Upcoming bool    `dynamodbav:"upcoming"`
	Details  *string `dynamodbav:"details" json:"details"`
	FlightNo string  `dynamodbav:"flight_number" json:"flight_number"`
}
