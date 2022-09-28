import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LayersIcon from '@mui/icons-material/Layers';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'routing/routes';
import { Fn } from 'types/global';
import { drawerWidth } from './Base';
import { useTranslation } from 'react-i18next';
import HomeIcon from '@mui/icons-material/Home';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AppsIcon from '@mui/icons-material/Apps';
import AddCardIcon from '@mui/icons-material/AddCard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    })
);

type Props = {
    toggleDrawer: Fn;
    drawerOpen: boolean;
};

function SideDrawer({ toggleDrawer, drawerOpen }: Props) {
    const { t } = useTranslation();

    const primaryList = useMemo(() => {
        return [];
    }, []);

    const adminList = useMemo(() => {
        return [];
    }, []);

    return (
        <Drawer variant="permanent" open={drawerOpen}>
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                }}
            >
                <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
                <Link to={routes.HOME.path}>
                    <ListItemButton>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('Home')} />
                    </ListItemButton>
                </Link>

                <Link to={routes.PLAYER_LIST.path}>
                    <ListItemButton>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('List graczy')} />
                    </ListItemButton>
                </Link>
                <ListItemButton>
                    <ListItemIcon>
                        <EmojiEventsIcon />
                    </ListItemIcon>
                    <ListItemText primary={t('Turnieje')} />
                </ListItemButton>
                <ListItemButton>
                    <ListItemIcon>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary={t('Statystyki')} />
                </ListItemButton>
                <Divider sx={{ my: 1 }} />

                <Link to={routes.CUP_CREATOR.path}>
                    <ListItemButton>
                        <ListItemIcon>
                            <AddCardIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('Nowy turniej')} />
                    </ListItemButton>
                </Link>
                <ListItemButton>
                    <ListItemIcon>
                        <PersonAddIcon />
                    </ListItemIcon>
                    <ListItemText primary={t('Nowy zawodnik')} />
                </ListItemButton>
            </List>
        </Drawer>
    );
}
export default React.memo(SideDrawer);
