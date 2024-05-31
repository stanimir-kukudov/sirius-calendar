import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DigitalClock } from '@mui/x-date-pickers';

export default function Time({
  highlightedDays,
  setReservationDate,
}: {
  highlightedDays: Dayjs[];
  setReservationDate: (date: Dayjs) => void;
}) {
  const handleChange = (value: Dayjs) => setReservationDate(value);

  return (
    <DigitalClock
      sx={{ maxHeight: 330 }}
      timeStep={60}
      disablePast
      skipDisabled
      minTime={dayjs().startOf('day').hour(7)}
      maxTime={dayjs().startOf('day').hour(18)}
      shouldDisableTime={(time, view) => {
        // console.log(time.hour(), view);

        return false;
      }}
      onChange={handleChange}
      ampm={false}
    />
  );
}
