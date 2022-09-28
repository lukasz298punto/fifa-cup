import { Typography } from '@mui/material';
import React from 'react';

function Title({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <Typography component="h2" variant="h6" color="primary" gutterBottom className={className}>
            {children}
        </Typography>
    );
}

export default Title;
