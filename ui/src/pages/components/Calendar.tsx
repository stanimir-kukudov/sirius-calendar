import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useQuery } from '@tanstack/react-query';
import utc from 'dayjs/plugin/utc';
import axios from 'axios';
import { Card, CardContent } from '@mui/material';
dayjs.extend(utc);

const initialValue = dayjs();

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

export default function Calendar() {
  const [month, setMonth] = React.useState<Dayjs>(initialValue);
  const {
    data: highlightedDays = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => axios.get(`/bookings?time=${month.endOf('month').utc().format()}`).then((response) => response.data),
  });

  const handleDateChange = (date: Dayjs) => {};

  const handleChange = (value: Dayjs, selectionState: any, selectedView?: string) => {
    if (selectedView === 'day') {
      console.log(value, selectionState, selectedView);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {error ? (
        <Card>
          <CardContent>Error: Please try again later.</CardContent>
        </Card>
      ) : (
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
      )}
    </LocalizationProvider>
  );
}
