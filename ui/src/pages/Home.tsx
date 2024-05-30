import Calendar from './components/Calendar';
import { Paper, Stack } from '@mui/material';

export const Home = () => {
  return (
    <Stack alignItems="center">
      <Paper>
        <Calendar />
      </Paper>
    </Stack>
  );
};
