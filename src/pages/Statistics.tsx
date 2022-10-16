import AddIcon from '@mui/icons-material/Add';
import { Button, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/system';
import { Loading } from 'components/Loading';
import { TableContainer } from 'components/TableContainer';
import { getAllPlayersResults } from 'helpers/calculate';
import { isCup } from 'helpers/global';
import { useAllCompletedTournamentListQuery, useAllPlayerListQuery } from 'hooks';
import {
    concat,
    filter,
    find,
    flatMap,
    flatten,
    includes,
    last,
    map,
    orderBy,
    reduce,
} from 'lodash';
import { EditedRow } from 'Modules/Player';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldArrayWithId, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TableCell } from 'style/components';
import { Player } from 'types/global';

export type Players = {
    players: Player[];
};

function Block({ name, value, player }: { name: string; value: number; player: string }) {
    return (
        <Grid item xs={12} md={4} lg={3}>
            <Paper className="p-5">
                <Box className="flex items-center">
                    <Typography variant="h5" className="font-bold">
                        {player}
                    </Typography>
                    <Typography color="primary" className="font-bold ml-2">
                        ({value})
                    </Typography>
                </Box>
                <Typography className="opacity-70 mt-1">{name}</Typography>
            </Paper>
        </Grid>
    );
}

function Statistics() {
    const { t } = useTranslation();
    const { data, isLoading } = useAllPlayerListQuery(true);
    const { data: tournamentData, isLoading: tournamentDataIsLoading } =
        useAllCompletedTournamentListQuery();

    const allResults = useMemo(() => {
        return flatten(
            flatMap(tournamentData?.docs, (tour) => {
                const data = tour.data();

                return map(data.phases, (phase) => {
                    if (isCup(phase)) {
                        return phase.results;
                    } else {
                        return flatMap(phase.groups, (group) => group.results);
                    }
                });
            })
        );
    }, [tournamentData]);

    const getPlayerName = useCallback(
        (id?: string) => {
            if (!id) return '';

            const player = find(data?.docs, { id: id })?.data();

            return `${player?.firstName || ''} ${player?.lastName || ''}`;
        },
        [data]
    );

    const statistics = useMemo(() => {
        const stats = getAllPlayersResults(map(data?.docs, 'id'), allResults);
        const mostBrPlus = orderBy(stats, 'brPlus', 'desc');
        const leastBrPlus = orderBy(stats, 'brPlus', 'asc');
        const mostBrMinus = orderBy(stats, 'brMinus', 'desc');
        const leastBrMinus = orderBy(stats, 'brMinus', 'asc');
        const mostW = orderBy(stats, 'w', 'desc');
        const mostP = orderBy(stats, 'p', 'desc');

        console.log(stats, 'stats');

        return {
            mostBrPlus: {
                player: getPlayerName(mostBrPlus[0]?.id),
                value: mostBrPlus[0]?.brPlus,
            },
            leastBrPlus: {
                player: getPlayerName(leastBrPlus[0]?.id),
                value: leastBrPlus[0]?.brPlus,
            },
            mostBrMinus: {
                player: getPlayerName(mostBrMinus[0]?.id),
                value: mostBrMinus[0]?.brPlus,
            },
            leastBrMinus: {
                player: getPlayerName(leastBrMinus[0]?.id),
                value: leastBrMinus[0]?.brPlus,
            },
            mostW: {
                player: getPlayerName(mostW[0]?.id),
                value: mostW[0]?.brPlus,
            },
            mostP: {
                player: getPlayerName(mostP[0]?.id),
                value: mostP[0]?.brPlus,
            },
        };
    }, [data, allResults, getPlayerName]);

    console.log(statistics, 'statistics');

    const statsList = useMemo(() => {
        return [
            {
                name: t('Najwięcej zdobytych bramek'),
                value: statistics.mostBrPlus.value,
                player: statistics.mostBrPlus.player,
            },
            {
                name: t('Najmniej zdobytych bramek'),
                value: statistics.leastBrPlus.value,
                player: statistics.leastBrPlus.player,
            },
            {
                name: t('Najwięcej straconych bramek'),
                value: statistics.mostBrMinus.value,
                player: statistics.mostBrMinus.player,
            },
            {
                name: t('Najmniej straconych bramek'),
                value: statistics.leastBrMinus.value,
                player: statistics.leastBrMinus.player,
            },
            {
                name: t('Najwięcej wygranych meczów'),
                value: statistics.mostW.value,
                player: statistics.mostW.player,
            },
            {
                name: t('Najwięcej przegranych meczów'),
                value: statistics.mostP.value,
                player: statistics.mostP.player,
            },
        ];
    }, [statistics, t]);

    if (isLoading || tournamentDataIsLoading) {
        return <CircularProgress size={24} />;
    }

    return (
        <Grid container spacing={2}>
            {map(statsList, ({ name, value, player }) => (
                <Block name={name} value={value} player={player} />
            ))}
        </Grid>
    );
}
export default Statistics;
