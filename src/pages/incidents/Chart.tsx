import type { FC } from 'react';
import type { ApexOptions } from 'apexcharts';
//import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { Chart } from './ChartHelp';

type ChartSeries = {
  name: string;
  data: number[];
}[];

const useChartOptions = (): ApexOptions => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ['#877eb4'],
    dataLabels: {
      enabled: false,
    },
    fill: {
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 100],
      },
      type: 'gradient',
    },
    grid: {
      borderColor: '#ced4da',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      size: 4,
      strokeWidth: 0,
      hover: {
        size: 4,
      }
    },
    stroke: {
      curve: 'smooth',
    },
    tooltip: {
      theme: 'dark',
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      categories: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      labels: {
        offsetY: 1,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      tickAmount: 5,
    },
    
  };
};

export const Chart4: FC<{ incidents: number[] }> = ({ incidents }) => {
  const currentMonth = new Date().getMonth();
  const categories = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ].slice(0, currentMonth + 1);
  const chartData = incidents.slice(0, currentMonth + 1);

  const chartOptions = useChartOptions();
  if (chartOptions.xaxis) {
    chartOptions.xaxis.categories = categories;
  } else {
    chartOptions.xaxis = { categories };
  }
  const chartSeries: ChartSeries = [
    {
      name: 'Incidents',
      data: chartData,
    },
  ];

  return (
    <Box
        sx={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        marginBottom: '40px',
        padding: '16px 8px',
        boxShadow:
        "rgba(0, 0, 0, 0.04) 0px 5px 22px 0px,rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
        }}
    >
        <Chart
        height={280}
        options={chartOptions}
        series={chartSeries}
        type="area"
        />
    </Box>
  );
};
