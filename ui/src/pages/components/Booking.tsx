import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import Calendar from './Calendar';
import utc from 'dayjs/plugin/utc';
import UserInfo from './UserInfo';
import { useEffect } from 'react';
dayjs.extend(utc);

const initialValue = dayjs();

export default function Booking() {
  const [reservationDate, setReservationDate] = React.useState<Dayjs>();
  const [currentPeriodDate, setCurrentPeriodDate] = React.useState<Dayjs>(initialValue);
  const {
    data: highlightedDays = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['bookings', currentPeriodDate.month(), currentPeriodDate.year()],
    queryFn: () =>
      axios
        .get(`/bookings?time=${currentPeriodDate.endOf('month').format('DD-MM-YYYYTHH:mm')}`)
        .then((response) => response.data),
  });

  useEffect(() => {
    isFetching && setReservationDate(undefined);
  }, [isFetching]);

  const handleSubmit = () => {
    reservationDate?.utc().format();
  };

  console.log(reservationDate?.format());

  return (
    <Box component="form">
      <Card>
        <CardContent>
          <Stack spacing={2}>
            {error ? (
              <Typography>Error: Please try again later.</Typography>
            ) : (
              <Calendar
                initialValue={initialValue}
                isLoading={isLoading}
                isFetching={isFetching}
                highlightedDays={highlightedDays}
                setCurrentPeriodDate={setCurrentPeriodDate}
                setReservationDate={setReservationDate}
              />
            )}
            {reservationDate && <UserInfo />}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
