import Booking from './components/Booking';
import { Paper, Stack } from '@mui/material';

export const Home = () => {
  return (
    <Stack alignItems="center">
      <Paper>
        <Booking />
      </Paper>
    </Stack>
  );
};
