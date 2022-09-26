import { CssBaseline } from '@mui/material';
import { green } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import 'locales/config';
import { QueryClient, QueryClientProvider } from 'react-query';
import Router from 'routing/Router';
import './root.css';

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
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router />
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default Root;
