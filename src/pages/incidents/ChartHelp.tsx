import ApexChart from 'react-apexcharts';
import { alpha } from '@mui/system/colorManipulator';
import { styled } from '@mui/material/styles';

export const Chart = styled(ApexChart)(({ theme }) => ({
  '& .apexcharts-xaxistooltip': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[16],
    borderRadius: theme.shape.borderRadius,
    border: 0,
    '&::before, &::after': {
      display: 'none',
    },
  },
  '& .apexcharts-tooltip': {
    '&.apexcharts-theme-light, &.apexcharts-theme-dark': {
      backdropFilter: 'blur(6px)',
      background: '#1b2431',
      border: 0,
      boxShadow: 'none',
      '& .apexcharts-tooltip-title': {
        background: alpha('#1b2431', 0.8),
        border: 0,
        color: theme.palette.common.white,
        margin: 0,
      },
      '& .apexcharts-tooltip-series-group': {
        background: alpha('#1b2431', 0.1),
        border: 0,
        color: theme.palette.common.white,
      },
    },
  },
}));
