import { IChartData } from 'shared/component/chart/lineChart';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import moment from 'moment-timezone';
import ChartComponent from 'shared/component/chart/lineChart';

export const formatDate = (date: any, format?: string) => {
    if (!date) {
        return '';
    }
    return moment(date)
        .local()
        .format(format || 'DD-MM-YYYY');
};

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export interface IWeatherGraph {
    weatherStats: any;
}

export const WeatherStatsGraph: React.FC<IWeatherGraph> = (props) => {
    const { weatherStats } = props;
    console.log("weatherStats", weatherStats);
    const createChartData = {
        labels: weatherStats.map((ele) => moment(ele.dt_txt, "YYYYMMDD").fromNow()),
        datasets: [
            {
                label: 'Temperature',
                data: weatherStats.map((ele) => ele.main.temp),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                tension: 0.4
            },
            {
                label: 'Humidity',
                data: weatherStats.map((ele) => ele.main.humidity),
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)",
                tension: 0.4
            },
            {
                label: 'Wind Speed',
                data: weatherStats.map((ele) => ele.wind.speed),
                borderColor: "rgb(88, 201, 71)",
                backgroundColor: 'rgba(88, 201, 71, 0.5)',
                tension: 0.4
            }
        ]
    };
    return (
        <ChartComponent data={createChartData as unknown as IChartData} width={400} />
    );
};