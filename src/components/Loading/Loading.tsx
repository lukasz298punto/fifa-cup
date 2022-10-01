import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

function Loading({
    children,
    loading,
}: {
    children: ((loading: boolean) => React.ReactNode) | React.ReactNode;
    loading: boolean;
}) {
    return (
        <Box sx={{ m: 1, position: 'relative', opacity: loading ? 0.6 : 1 }}>
            {typeof children === 'function' ? children(loading) : children}
            {loading && (
                <CircularProgress
                    size={24}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                    }}
                />
            )}
        </Box>
    );
}
export default Loading;
