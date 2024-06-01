import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Box, Button, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import Calendar from './Calendar';
import utc from 'dayjs/plugin/utc';
import UserInfo, { UserInfoType } from './UserInfo';
import { useCallback, useEffect } from 'react';
import { useStep } from 'usehooks-ts';
import Summary from './Summary';
import { enqueueSnackbar } from 'notistack';
dayjs.extend(utc);

const initialValue = dayjs();

export type BookingType = {
  id: number;
  user: UserInfoType;
  time: Dayjs;
};

export default function Booking() {
  const [userInfoErrors, setUserInfoErrors] = React.useState<Array<keyof UserInfoType>>([]);
  const [reservationDate, setReservationDate] = React.useState<Dayjs>();
  const [userInfo, setUserInfo] = React.useState<UserInfoType>();
  const [currentPeriodDate, setCurrentPeriodDate] = React.useState<Dayjs>(initialValue);
  const {
    data: existingBookings = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<BookingType[]>({
    queryKey: ['bookings', currentPeriodDate.month(), currentPeriodDate.year()],
    queryFn: () =>
      axios
        .get(`/bookings?time=${currentPeriodDate.endOf('month').format('DD-MM-YYYYTHH:mm')}`)
        .then((response) => response.data.map((d: BookingType) => ({ ...d, time: dayjs(d.time) }))),
  });
  const bookingMutation = useMutation({
    mutationFn: (booking: { reservationDate: string; userInfo: UserInfoType }) => axios.post('/bookings', booking),
    onError: (error: AxiosError<{ message: string }>) => {
      enqueueSnackbar(`Error: ${error.response?.data?.message || error.message}`, { variant: 'error' });
    },
    onSuccess: () => {
      enqueueSnackbar('Booking successful', { variant: 'success' });
      setTimeout(() => window.location.reload(), 1000);
    },
  });

  const steps = [
    {
      label: 'Select Date & Time',
      content: (
        <Calendar
          initialValue={initialValue}
          isLoading={isLoading}
          isFetching={isFetching}
          existingBookings={existingBookings}
          setCurrentPeriodDate={setCurrentPeriodDate}
          setReservationDate={setReservationDate}
        />
      ),
    },
    { label: 'Add User Info', content: <UserInfo userInfoErrors={userInfoErrors} setUserInfo={setUserInfo} /> },
    { label: 'Booking Summary', content: <Summary reservationDate={reservationDate} userInfo={userInfo} /> },
  ];

  const [currentStep, helpers] = useStep(steps.length);
  const activeStep = currentStep - 1;
  const { canGoToPrevStep, canGoToNextStep, goToNextStep, goToPrevStep } = helpers;

  useEffect(() => {
    isFetching && setReservationDate(undefined);
  }, [isFetching]);

  const handleSubmit = () => {
    // enqueueSnackbar('I love hooks');
    reservationDate &&
      userInfo &&
      bookingMutation.mutate({ reservationDate: reservationDate.utc().format('DD-MM-YYYYTHH:mm'), userInfo });
  };

  const validateUserInfo = useCallback(() => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const bulgarianPhonePattern = /^(?:\+359|0)?(?:87|88|89|98|99|2)\d{7}$/;
    const errors: Array<keyof UserInfoType> = [];

    if (userInfo?.firstName === '') {
      errors.push('firstName');
    }

    if (userInfo?.lastName === '') {
      errors.push('lastName');
    }

    if (!emailPattern.test(userInfo?.email || '')) {
      errors.push('email');
    }

    if (!bulgarianPhonePattern.test(userInfo?.phoneNumber || '')) {
      errors.push('phoneNumber');
    }

    setUserInfoErrors(errors);
  }, [userInfo?.firstName, userInfo?.lastName, userInfo?.email, userInfo?.phoneNumber, setUserInfoErrors]);

  useEffect(() => {
    !canGoToNextStep && validateUserInfo();
  }, [canGoToNextStep, validateUserInfo]);

  return error ? (
    <Typography>Error: Please try again later.</Typography>
  ) : (
    <Box component="form" sx={{ width: 1 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(({ label }, index) => (
          <Step key={label}>
            <StepLabel error={!!(index === 1 && userInfoErrors.length)}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Stack spacing={3} alignItems="center">
        {steps.map(({ label, content }, index) => (
          <Stack
            key={label}
            sx={{ width: 1, display: activeStep === index ? 'flex' : 'none', pt: 4 }}
            alignItems="center"
          >
            {content}
          </Stack>
        ))}
        <Stack direction="row" justifyContent="center" spacing={2}>
          <Button disabled={!canGoToPrevStep} variant="contained" size="large" onClick={goToPrevStep}>
            Back
          </Button>
          <Button
            variant="contained"
            size="large"
            disabled={
              bookingMutation.isPending ||
              bookingMutation.isSuccess ||
              !reservationDate ||
              (!canGoToNextStep && !!userInfoErrors.length)
            }
            onClick={canGoToNextStep ? goToNextStep : handleSubmit}
          >
            {canGoToNextStep ? 'Next' : 'Save'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
