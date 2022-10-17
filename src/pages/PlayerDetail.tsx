import {
    Avatar,
    CircularProgress,
    Grid,
    Paper,
    TableBody,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import Table from '@mui/material/Table';
import { Title } from 'components/Title';
import { getAllPlayersResults, getAllResults, getTournamentSequence } from 'helpers/calculate';
import { useAllCompletedTournamentListQuery, usePlayerQuery } from 'hooks';
import { findIndex, indexOf, map, upperCase } from 'lodash';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { TableCell } from 'style/components';

function MiniBlock({ label, value }: { label: string; value: number }) {
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Title>{label}</Title>
            <Typography variant="h4" className="font-bold">
                {value}
            </Typography>
        </Paper>
    );
}

function PlayerDetail() {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = usePlayerQuery(id as string);
    const { data: tournamentData, isLoading: tournamentDataIsLoading } =
        useAllCompletedTournamentListQuery();
    const { t } = useTranslation();

    const allResults = useMemo(() => {
        return getAllResults(tournamentData?.docs);
    }, [tournamentData]);

    const playerStats = useMemo(() => {
        const stats = getAllPlayersResults([id], allResults);

        return stats;
    }, [allResults, id]);

    const statsList = useMemo(() => {
        return [
            {
                name: t('W'),
                value: playerStats?.[0]?.w,
                xs: 4,
                md: 2,
            },
            {
                name: t('R'),
                value: playerStats?.[0]?.r,
                xs: 4,
                md: 2,
            },
            {
                name: t('P'),
                value: playerStats?.[0]?.p,
                xs: 4,
                md: 2,
            },
            {
                name: t('Br+'),
                value: playerStats?.[0]?.brPlus,
                xs: 6,
                md: 3,
            },
            {
                name: t('Br-'),
                value: playerStats?.[0]?.brMinus,
                xs: 6,
                md: 3,
            },
        ];
    }, [playerStats, t]);

    const playerDetails = useMemo(() => {
        return {
            firstName: data?.data()?.firstName || '',
            lastName: data?.data()?.lastName || '',
        };
    }, [data]);

    if (isLoading || tournamentDataIsLoading) {
        return <CircularProgress size={24} />;
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar className="mr-2" sx={{ bgcolor: deepOrange[500] }}>
                            {upperCase(playerDetails.firstName?.[0] || '')}
                            {upperCase(playerDetails.lastName?.[0] || '')}
                        </Avatar>
                        <Typography variant="h5" className="font-bold">
                            {playerDetails.firstName} {playerDetails.lastName}
                        </Typography>
                    </Paper>
                </Grid>
                {map(statsList, ({ name, value, xs, md }, index) => (
                    <Grid item xs={xs} md={md} key={index}>
                        <MiniBlock label={name} value={value} />
                    </Grid>
                ))}
                <Grid item xs={12} md={12} lg={12}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Title>{t('Historia turniejów')}</Title>

                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('Nazwa turnieju')}</TableCell>
                                    <TableCell>{t('Pozycja')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {map(tournamentData?.docs, (snap) => {
                                    const tournament = snap.data();
                                    const position =
                                        indexOf(getTournamentSequence(tournament.phases), id) + 1;

                                    return (
                                        <TableRow key={snap.id}>
                                            <TableCell>{tournament.name}</TableCell>
                                            <TableCell>
                                                {position ? position : t('Nie brał udziału')}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}
export default PlayerDetail;
