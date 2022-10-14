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
import useTournamentListQuery from 'hooks/useTournamentListQuery';
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

const rows = [
    createData(0, '16 Mar, 2019', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(1, '16 Mar, 2019', 'Paul McCartney', 'London, UK', 'VISA ⠀•••• 2574', 866.99),
    createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
    createData(3, '16 Mar, 2019', 'Michael Jackson', 'Gary, IN', 'AMEX ⠀•••• 2000', 654.39),
    createData(
        4,
        '15 Mar, 2019',
        'Bruce Springsteen',
        'Long Branch, NJ',
        'VISA ⠀•••• 5919',
        212.79
    ),
];
const rows2 = [
    createData(0, '1', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(0, '2', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(0, '3', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(0, '4', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(0, '5', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(0, '6', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(0, '7', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(0, '8', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(0, '9', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(0, '10', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(0, '11', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(0, '12', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(0, '13', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(0, '14', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(0, '15', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(0, '16', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
];

function LastTournament() {
    const { t } = useTranslation();
    const { data, isLoading } = useActivePlayerListQuery();

    const { data: tournamentData, isLoading: tournamentDataIsLoading } = useTournamentListQuery(
        query(
            collection(firestore, 'tournaments'),
            where('endDate', '!=', null)
        ) as CollectionReference<Tournament>,
        'all-completed'
    );

    console.log(tournamentData?.docs, 'tournamentData');

    const calculate = useMemo(() => {
        const www = map(tournamentData?.docs, (tour) =>
            getTournamentSequence(tour?.data()?.phases)
        );

        const winners = {
            first: flatten(Array.from(new Set(filter(www, (val, index) => index === 0)))),
            second: flatten(Array.from(new Set(filter(www, (val, index) => index === 1)))),
            third: flatten(Array.from(new Set(filter(www, (val, index) => index === 2)))),
        };
        console.log(winners, 'winners');

        return filter(
            orderBy(
                map(data?.docs, (snap) => {
                    return {
                        firstName: snap.data().firstName,
                        lastName: snap.data().lastName,
                        first: size(filter(winners.first, (val) => val === snap.id)),
                        second: size(filter(winners.second, (val) => val === snap.id)),
                        third: size(filter(winners.third, (val) => val === snap.id)),
                    };
                }),
                ['first', 'second', 'third'],
                ['desc', 'desc', 'desc']
            ),
            (val) => val.first || val.second || val.third
        );
    }, [data?.docs, tournamentData?.docs]);

    console.log(calculate, 'calculate');

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
                        <TableCell>
                            <MilitaryTechIcon sx={{ color: yellow[600] }} />
                        </TableCell>
                        <TableCell>
                            <MilitaryTechIcon sx={{ color: grey[400] }} />
                        </TableCell>
                        <TableCell>
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
