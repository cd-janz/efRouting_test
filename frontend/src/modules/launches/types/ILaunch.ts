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
export interface IYearGroupLaunch{
    Year: string;
    Total: number;
}
export interface IFullYearGroupLaunch{
    year: string;
    total: number;
    success: number;
    failed: number;
    upcoming: boolean;
    done: number;
}
export interface ILaunchRate{
    Invalid: number;
    Valid: number;
}