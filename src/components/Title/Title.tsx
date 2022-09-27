import { Typography } from '@mui/material';
import React from 'react';

function Title({ children }: { children: React.ReactNode }) {
    return (
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {children}
        </Typography>
    );
}

export default Title;
