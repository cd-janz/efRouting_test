"use client"
import {IYearGroupLaunch} from "@/modules/launches/types/ILaunch";
import {
    CategoryScale,
    Chart, Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";
import {useMemo} from "react";
import {Line} from "react-chartjs-2";

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);
export const getOptions = (title: string) => {
  return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
          legend: {
              position: 'top' as const,
          },
          title: {
              display: true,
              text: title,
          },
      },
    }
}

interface Props{
    data: IYearGroupLaunch[]
}
export default function YearGraphic(props: Props){

    const memoData = useMemo(() => {
        return {
            labels: props.data.map(i => i.Year),
            datasets: [
                {
                    fill: true,
                    label: "Launches",
                    data: props.data.map(i => i.Total),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                }
            ]
        }
    }, [props.data]);

    return <Line options={getOptions('SpaceX Launches Frequency')} data={memoData}/>
}