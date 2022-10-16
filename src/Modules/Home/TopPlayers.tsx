import { CircularProgress } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Title } from 'components/Title';
import { firestore } from 'config/firebase';
import { collection, CollectionReference, limit, query, where } from 'firebase/firestore';
import { getTournamentSequence } from 'helpers/calculate';
import { findPlayerNameById } from 'helpers/global';
import { useActivePlayerListQuery } from 'hooks';
import useTournamentListQuery, {
    useAllCompletedTournamentListQuery,
} from 'hooks/useTournamentListQuery';
import { concat, filter, flatten, includes, map, reduce, size, orderBy, get } from 'lodash';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TableCell } from 'style/components';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { Tournament } from 'types/global';
import { brown, grey, yellow } from '@mui/material/colors';

function createData(
    id: number,
    date: string,
    name: string,
    shipTo: string,
    paymentMethod: string,
    amount: number
) {
    return { id, date, name, shipTo, paymentMethod, amount };
}

const getMedalsByPlayerId = (players: string[][], playerId: string) => {
    return reduce(
        players,
        (acc, current) => {
            return {
                first: current[0] === playerId ? acc.first + 1 : acc.first,
                second: current[1] === playerId ? acc.first + 1 : acc.second,
                third: current[2] === playerId ? acc.first + 1 : acc.third,
            };
        },
        {
            first: 0,
            second: 0,
            third: 0,
        }
    );
};

function LastTournament() {
    const { t } = useTranslation();
    const { data, isLoading } = useActivePlayerListQuery();

    const { data: tournamentData, isLoading: tournamentDataIsLoading } =
        useAllCompletedTournamentListQuery();

    const calculate = useMemo(() => {
        const www = map(tournamentData?.docs, (tour) =>
            getTournamentSequence(tour?.data()?.phases)
        );

        console.log(www, 'www');

        const winners = {
            first: flatten(filter(www, (val, index) => index === 0)),
            second: flatten(filter(www, (val, index) => index === 1)),
            third: flatten(filter(www, (val, index) => index === 2)),
        };
        console.log(winners, 'winners');

        return filter(
            orderBy(
                map(data?.docs, (snap) => {
                    const result = getMedalsByPlayerId(www, snap.id);

                    return {
                        firstName: snap.data().firstName,
                        lastName: snap.data().lastName,
                        first: result.first,
                        second: result.second,
                        third: result.third,
                    };
                }),
                ['first', 'second', 'third'],
                ['desc', 'desc', 'desc']
            ),
            (val) => val.first || val.second || val.third
        );
    }, [data?.docs, tournamentData?.docs]);

    if (tournamentDataIsLoading || isLoading) {
        return <CircularProgress size={24} />;
    }

    return (
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Title>{t('Top zawodnicy')}</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="center">
                            <MilitaryTechIcon sx={{ color: yellow[600] }} />
                        </TableCell>
                        <TableCell align="center">
                            <MilitaryTechIcon sx={{ color: grey[400] }} />
                        </TableCell>
                        <TableCell align="center">
                            <MilitaryTechIcon sx={{ color: brown[400] }} />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {map(calculate, (row, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {get(row, 'firstName', '') + ' ' + get(row, 'lastName', '')}
                            </TableCell>
                            <TableCell align="center">{get(row, 'first', '')}</TableCell>
                            <TableCell align="center">{get(row, 'second', '')}</TableCell>
                            <TableCell align="center">{get(row, 'third', '')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
export default React.memo(LastTournament);
