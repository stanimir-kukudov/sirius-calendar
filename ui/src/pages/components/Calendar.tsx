import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Stack } from '@mui/material';
import Time from './Time';
import { Dispatch, SetStateAction } from 'react';
import { BookingType } from './Booking';

function ServerDay(props: any & { highlightedDays?: number[] }) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected = !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? <FiberManualRecordIcon fontSize="inherit" /> : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

export default function Calendar({
  initialValue,
  isLoading,
  isFetching,
  existingBookings,
  setCurrentPeriodDate,
  setReservationDate,
}: {
  initialValue: Dayjs;
  isLoading: boolean;
  isFetching: boolean;
  existingBookings: BookingType[];
  setCurrentPeriodDate: Dispatch<SetStateAction<Dayjs>>;
  setReservationDate: Dispatch<SetStateAction<Dayjs | undefined>>;
}) {
  const [reservationMonth, setReservationMonth] = React.useState<Dayjs>(initialValue);

  const handleDateChange = (date: Dayjs) => setCurrentPeriodDate(date);

  const handleChange = (value: Dayjs, selectionState: any, selectedView?: string) =>
    selectedView === 'day' && setReservationMonth(value);

  return (
    <Stack direction="row" spacing={2}>
      <Time
        key={reservationMonth.toString()}
        existingBookings={existingBookings}
        reservationMonth={reservationMonth}
        setReservationDate={(date: Dayjs) =>
          setReservationDate(dayjs(reservationMonth).hour(date.hour()).minute(date.minute()))
        }
      />
      <div>
        <DateCalendar
          disablePast
          defaultValue={initialValue}
          loading={isLoading}
          onMonthChange={handleDateChange}
          onYearChange={handleDateChange}
          onChange={handleChange}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{ day: ServerDay }}
          slotProps={{
            day: {
              highlightedDays: existingBookings.map(({ time }) => time.date()),
            } as any,
          }}
        />
      </div>
    </Stack>
  );
}
