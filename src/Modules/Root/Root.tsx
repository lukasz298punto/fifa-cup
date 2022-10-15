import { CssBaseline } from '@mui/material';
import { green } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import 'locales/config';
import 'date-fns/locale/pl';
import { QueryClient, QueryClientProvider } from 'react-query';
import Router from 'routing/Router';
import './root.css';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const theme = createTheme({
    palette: {
        primary: {
            main: green[600],
        },
    },
});

const queryClient = new QueryClient();

function Root() {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Router />
                </ThemeProvider>
            </QueryClientProvider>
        </LocalizationProvider>
    );
}

export default Root;
