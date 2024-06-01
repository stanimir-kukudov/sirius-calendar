import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { UserInfoType } from './UserInfo';
import * as _ from 'lodash';

interface SummaryProps {
  reservationDate?: dayjs.Dayjs | undefined;
  userInfo?: UserInfoType | undefined;
}

export default function Summary({ reservationDate, userInfo }: SummaryProps) {
  return (
    <Stack spacing={2} alignContent="center">
      <Typography variant="h2">Summary</Typography>
      <Typography>
        <b>Reservation Date:</b> {reservationDate?.format('YYYY-MM-DD HH:mm')}
      </Typography>
      {userInfo &&
        Object.keys(userInfo).map((key, index) => (
          <Typography key={index}>
            <b>{_.upperFirst(_.lowerCase(key))}:</b> {userInfo[key as keyof UserInfoType]}
          </Typography>
        ))}
    </Stack>
  );
}
