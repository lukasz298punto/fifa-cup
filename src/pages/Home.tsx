import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { Typography } from '@mui/material';
import { brown, grey, yellow } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Title } from 'components/Title';
import { firestore } from 'config/firebase';
import { collection, CollectionReference, limit, orderBy, query, where } from 'firebase/firestore';
import { getTournamentSequence } from 'helpers/calculate';
import { findPlayerNameById } from 'helpers/global';
import { useActivePlayerListQuery } from 'hooks';
import useTournamentListQuery from 'hooks/useTournamentListQuery';
import { map } from 'lodash';
import { LastTournament } from 'Modules/Home';
import TopPlayers from 'Modules/Home/TopPlayers';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TableCell } from 'style/components';
import { Tournament } from 'types/global';

function Home() {
    return (
        <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Title>Następny turniej</Title>

                            <Typography color="text.secondary" sx={{ flex: 1 }}>
                                on 15 March, 2019
                            </Typography>

                            {/* <Chart /> */}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <LastTournament />
                    </Grid>
                </Grid>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
                <TopPlayers />
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12} md={4} lg={3}></Grid>
        </Grid>
    );
}
export default Home;
