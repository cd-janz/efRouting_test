"use client"
import {useEffect, useState} from "react";
import {IFullYearGroupLaunch, ILaunchRate, IYearGroupLaunch} from "@/modules/launches/types/ILaunch";
import YearGraphic from "@/modules/launches/components/YearGraphic";
import handleNoMetadata from "@/core/api/handler/handleNoMetadata";
import SuccessPie from "@/modules/launches/components/SuccessPie";
import YearlyStats from "@/modules/launches/components/YearlyStats";

export default function LaunchesGraphicsEntry(){
    const [yearGrouped, setYearGrouped] = useState<IYearGroupLaunch[]>([])
    const [upcomingLaunches, setUpcomingLaunches] = useState<ILaunchRate>()
    const [fullYearGrouped, setFullYearGrouped] = useState<IFullYearGroupLaunch[]>([])

    useEffect(() => {
        (async () => {
            try {
                const [yearsData, upcomingRate, fullData] = await Promise.all([
                    handleNoMetadata<IYearGroupLaunch[]>("/launches/year-rate"),
                    handleNoMetadata<ILaunchRate>("/launches/upcoming"),
                    handleNoMetadata<IFullYearGroupLaunch[]>("/launches/year-rate/full"),
                ]);
                setYearGrouped(yearsData);
                setUpcomingLaunches(upcomingRate)
                setFullYearGrouped(fullData);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    return(
        <div className="grid gap-y-5 gap-x-4 py-5 h-full grid-cols-1 grid-rows-3 lg:h-full lg:grid-rows-2 lg:grid-cols-2">
            <div className="relative lg:col-span-2">
                <YearlyStats data={fullYearGrouped} title="Full Yearly stacks"/>
            </div>
            <div className="relative">
                {upcomingLaunches && (
                    <SuccessPie title="Global upcoming rate" data={upcomingLaunches} label={["upcoming", "done"]}/>
                )}
            </div>
            <div className="relative">
                <YearGraphic data={yearGrouped} />
            </div>
        </div>
    )
}