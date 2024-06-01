import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DigitalClock } from '@mui/x-date-pickers';
import { BookingType } from './Booking';

export default function Time({
  existingBookings,
  setReservationDate,
  reservationMonth,
}: {
  existingBookings: BookingType[];
  setReservationDate: (date: Dayjs) => void;
  reservationMonth?: dayjs.Dayjs;
}) {
  const handleChange = (value: Dayjs) => setReservationDate(value);

  return (
    <DigitalClock
      referenceDate={reservationMonth}
      sx={{ maxHeight: 330 }}
      timeStep={60}
      disablePast
      minTime={dayjs().startOf('day').hour(7)}
      maxTime={dayjs().startOf('day').hour(18)}
      shouldDisableTime={(time, view) => !!existingBookings.find((booking) => booking.time.isSame(time))}
      onChange={handleChange}
      ampm={false}
    />
  );
}
