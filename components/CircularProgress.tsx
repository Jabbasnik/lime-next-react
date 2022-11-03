import * as React from 'react';
import CircularIndeterminate from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularProgress() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularIndeterminate />
    </Box>
  );
}