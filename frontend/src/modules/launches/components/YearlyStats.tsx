import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {IFullYearGroupLaunch} from "@/modules/launches/types/ILaunch";
import {useMemo} from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

interface Props{
    data: IFullYearGroupLaunch[]
    title: string
}
export default function YearlyStats(props: Props) {
    const memoData = useMemo(()=>{
        return {
            labels: props.data.map(i => i.year),
            datasets: [
                {
                    fill: true,
                    label: 'Success',
                    data: props.data.map(i => i.success),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                },
                {
                    fill: true,
                    label: 'Failed',
                    data: props.data.map(i => i.failed),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                },
                {
                    fill: true,
                    label: 'Upcoming',
                    data: props.data.map(i => i.upcoming),
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 0.2)'
                },
                {
                    fill: true,
                    label: 'Done',
                    data: props.data.map(i => i.done),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                }
            ],
        };
    },[props.data])
    const memOptions = useMemo(() => {
        return {
            indexAxis: 'x' as const,
            elements: {
                bar: {
                    borderWidth: 2,
                },
            },
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom' as const,
                },
                title: {
                    display: true,
                    text: props.title,
                },
            },
        }
    }, [props.title])
    // @ts-ignore
    return <Line options={memOptions} data={memoData} />
}