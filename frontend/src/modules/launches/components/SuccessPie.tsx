import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import {ILaunchRate} from "@/modules/launches/types/ILaunch";
import {useMemo} from "react";
import {getOptions} from "@/modules/launches/components/YearGraphic";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props{
    title: string;
    data: ILaunchRate
    label: string[];
}
export default function SuccessPie(props: Props){
    const memoData = useMemo(() => {
        return {
            labels: props.label,
            datasets: [
                {
                    label: "Success Rate",
                    data: [props.data.Valid, props.data.Invalid],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1,
                }
            ]
        }    }, [props.data]);
    return <Pie options={getOptions(props.title)} data={memoData} />
}