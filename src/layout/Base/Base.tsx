import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideDrawer from './SideDrawer';
import TopBar from './TopBar';

// import Chart from './Chart';
// import Deposits from './Deposits';
// import Orders from './Orders';

export const drawerWidth = 240;

function Base() {
    const [open, setOpen] = useState(false);

    const toggleDrawer = useCallback(() => {
        setOpen((prev) => !prev);
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <TopBar toggleDrawer={toggleDrawer} drawerOpen={open} />
            <SideDrawer toggleDrawer={toggleDrawer} drawerOpen={open} />
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
}

export default Base;
