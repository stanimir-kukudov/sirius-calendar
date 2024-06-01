import * as React from 'react';
import { Stack, TextField } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

export type UserInfoType = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

interface UserInfoProps {
  setUserInfo: Dispatch<SetStateAction<UserInfoType | undefined>>;
  userInfoErrors: Array<keyof UserInfoType>;
}

export default function UserInfo({ setUserInfo, userInfoErrors }: UserInfoProps) {
  const handeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo((prevState) => ({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      ...(prevState || {}),
      [event.target.name as keyof UserInfoType]: event.target.value,
    }));
  };

  return (
    <Stack spacing={2} sx={{ minWidth: 300 }}>
      <TextField
        label="First name"
        variant="outlined"
        name="firstName"
        onChange={handeChange}
        error={userInfoErrors.includes('firstName')}
        helperText={userInfoErrors.includes('firstName') && 'Invalid first name'}
      />
      <TextField
        label="Last name"
        variant="outlined"
        name="lastName"
        onChange={handeChange}
        error={userInfoErrors.includes('lastName')}
        helperText={userInfoErrors.includes('lastName') && 'Invalid last name'}
      />
      <TextField
        label="Email"
        type="email"
        variant="outlined"
        name="email"
        onChange={handeChange}
        error={userInfoErrors.includes('email')}
        helperText={userInfoErrors.includes('email') && 'Invalid email'}
      />
      <TextField
        label="Phone number"
        type="number"
        variant="outlined"
        name="phoneNumber"
        onChange={handeChange}
        error={userInfoErrors.includes('phoneNumber')}
        helperText={userInfoErrors.includes('phoneNumber') ? 'Invalid phone number' : 'format: 0871234567'}
      />
    </Stack>
  );
}
