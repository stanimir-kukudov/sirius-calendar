import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Stack } from '@mui/material';
import Time from './Time';

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
  highlightedDays,
  setCurrentPeriodDate,
  setReservationDate,
}: {
  initialValue: Dayjs;
  isLoading: boolean;
  isFetching: boolean;
  highlightedDays: Dayjs[];
  setCurrentPeriodDate: (value: ((prevState: dayjs.Dayjs) => dayjs.Dayjs) | dayjs.Dayjs) => void;
  setReservationDate: (
    value: ((prevState: dayjs.Dayjs | undefined) => dayjs.Dayjs | undefined) | dayjs.Dayjs | undefined,
  ) => void;
}) {
  const [reservationMonth, setReservationMonth] = React.useState<Dayjs>(initialValue);

  const handleDateChange = (date: Dayjs) => setCurrentPeriodDate(date);

  const handleChange = (value: Dayjs, selectionState: any, selectedView?: string) =>
    selectedView === 'day' && setReservationMonth(value);

  return (
    <Stack direction="row" spacing={2}>
      <Time
        key={isFetching.toString()}
        highlightedDays={highlightedDays}
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
              highlightedDays,
            } as any,
          }}
        />
      </div>
    </Stack>
  );
}
