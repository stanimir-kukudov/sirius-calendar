import { PropsWithChildren } from 'react';
import { Box } from '@mui/material';

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
          {children}
        </Box>
    </Box>
  );
};
