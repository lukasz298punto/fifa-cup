import { QueryClient, QueryClientProvider } from 'react-query';
import './root.css';
import 'locales/config';
import { useTranslation } from 'react-i18next';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, purple, lightGreen } from '@mui/material/colors';
import { Button, CssBaseline } from '@mui/material';
import Dashboard from './Dashboard';

const theme = createTheme({
    palette: {
        primary: {
            main: green[600],
        },
    },
});

const queryClient = new QueryClient();

function Root() {
    const { t } = useTranslation();

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Dashboard />
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default Root;
