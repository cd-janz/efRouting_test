export default interface ILaunch {
    launch_id: string;
    mission_name: string;
    rocket_id: string;
    launch_date?: string;
    success: boolean;
    upcoming: boolean;
    details?: string;
    flight_number: string;
}