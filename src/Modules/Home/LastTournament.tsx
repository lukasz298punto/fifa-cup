import { CircularProgress } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Title } from 'components/Title';
import { firestore } from 'config/firebase';
import { collection, CollectionReference, limit, orderBy, query } from 'firebase/firestore';
import { getTournamentSequence } from 'helpers/calculate';
import { findPlayerNameById } from 'helpers/global';
import { useActivePlayerListQuery } from 'hooks';
import useTournamentListQuery from 'hooks/useTournamentListQuery';
import { map } from 'lodash';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TableCell } from 'style/components';
import { Tournament } from 'types/global';

function LastTournament() {
    const { t } = useTranslation();
    const { data, isLoading } = useActivePlayerListQuery();

    const { data: tournamentData, isLoading: tournamentDataIsLoading } = useTournamentListQuery(
        query(
            collection(firestore, 'tournaments'),
            limit(1),
            orderBy('endDate', 'desc')
        ) as CollectionReference<Tournament>,
        'last'
    );

    const calculate = useMemo(() => {
        return getTournamentSequence(tournamentData?.docs?.[0]?.data()?.phases);
    }, [tournamentData?.docs]);

    if (tournamentDataIsLoading || isLoading) {
        return <CircularProgress size={24} />;
    }

    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Title>{t('Wyniki z ostatniego turnieju')}</Title>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell width={10}>{t('Pozycja')}</TableCell>
                        <TableCell>{t('Imię i Nazwisko')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {map(calculate, (row, index) => (
                        <TableRow key={row}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{findPlayerNameById(row, data?.docs)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
export default React.memo(LastTournament);
