import VisibilityIcon from '@mui/icons-material/Visibility';
import { Chip, CircularProgress, IconButton, useMediaQuery } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { TableCell } from 'style/components';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Loading } from 'components/Loading';
import { TableContainer } from 'components/TableContainer';
import { dateTimeFormat } from 'constants/global';
import { format } from 'date-fns';
import useTournamentListQuery from 'hooks/useTournamentListQuery';
import { get, map } from 'lodash';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';
import { routes } from 'routing/routes';
import { Player, Tournament, TournamentSchema } from 'types/global';
import CachedIcon from '@mui/icons-material/Cached';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DoneIcon from '@mui/icons-material/Done';
import LoopIcon from '@mui/icons-material/Loop';
import { firestore } from 'config/firebase';
import { collection, CollectionReference, orderBy, query } from 'firebase/firestore';
import { useTheme } from '@emotion/react';

export type Players = {
    players: Player[];
};

function TournamentList() {
    const theme = useTheme();
    const { data, isLoading } = useTournamentListQuery(
        query(
            collection(firestore, 'tournaments'),
            orderBy('startDate', 'desc')
        ) as CollectionReference<TournamentSchema>
    );
    const { t } = useTranslation();
    const navigate = useNavigate();
    const matches = useMediaQuery(get(theme, 'breakpoints').down('sm'));

    if (isLoading) {
        return <CircularProgress size={24} />;
    }

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{t('Nazwa')}</TableCell>
                        {!matches && (
                            <TableCell width={200} align="center">
                                {t('Data startu')}
                            </TableCell>
                        )}
                        {!matches && (
                            <TableCell width={200} align="center">
                                {t('Data zakończenia')}
                            </TableCell>
                        )}

                        <TableCell width={100} align="center">
                            {t('Akcje')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {map(data?.docs, (docSnapshot) => {
                        const { endDate, name, startDate } = docSnapshot.data();

                        return (
                            <TableRow hover key={docSnapshot.id}>
                                <TableCell align="left">
                                    {startDate && !endDate && (
                                        <Chip
                                            label="live"
                                            color="success"
                                            // variant="outlined"
                                            size="small"
                                        />
                                    )}
                                    <span className="ml-1">{name}</span>
                                </TableCell>
                                {!matches && (
                                    <TableCell align="center">
                                        {startDate && format(new Date(startDate), dateTimeFormat)}
                                    </TableCell>
                                )}
                                {!matches && (
                                    <TableCell align="center">
                                        {endDate && format(new Date(endDate), dateTimeFormat)}
                                    </TableCell>
                                )}
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            navigate(
                                                generatePath(routes.TOURNAMENT_DETAIL.path, {
                                                    id: docSnapshot.id,
                                                })
                                            );
                                        }}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default TournamentList;
