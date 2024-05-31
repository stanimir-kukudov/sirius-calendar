import * as React from 'react';
import { Stack, TextField } from '@mui/material';

export default function UserInfo() {
  return (
    <Stack spacing={2}>
      <TextField label="First name" variant="outlined" />
      <TextField label="Last name" variant="outlined" />
      <TextField label="Email" type="email" variant="outlined" />
      <TextField label="Phone number" type="number" variant="outlined" />
    </Stack>
  );
}
