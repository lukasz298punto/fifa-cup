import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from '@mui/material';
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
import { map } from 'lodash';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';
import { routes } from 'routing/routes';
import { Player } from 'types/global';
import CachedIcon from '@mui/icons-material/Cached';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DoneIcon from '@mui/icons-material/Done';
import LoopIcon from '@mui/icons-material/Loop';

export type Players = {
    players: Player[];
};

function TournamentList() {
    const { data, isLoading } = useTournamentListQuery();
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Loading loading={isLoading}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('Nazwa')}</TableCell>
                            <TableCell width={200} align="center">
                                {t('Data startu')}
                            </TableCell>
                            <TableCell width={200} align="center">
                                {t('Data zakończenia')}
                            </TableCell>
                            <TableCell width={50} align="center">
                                {t('Status')}
                            </TableCell>
                            <TableCell width={100} align="center">
                                {t('Akcje')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {map(data?.docs, (docSnapshot) => {
                            const { endDate, name, startDate } = docSnapshot.data();

                            console.log(endDate, 'endDate');

                            return (
                                <TableRow hover key={docSnapshot.id}>
                                    <TableCell align="left">{name}</TableCell>
                                    <TableCell align="center">
                                        {startDate && format(new Date(startDate), dateTimeFormat)}
                                    </TableCell>
                                    <TableCell align="center">
                                        {endDate && format(new Date(endDate), dateTimeFormat)}
                                    </TableCell>
                                    <TableCell align="center">
                                        {endDate ? (
                                            <DoneIcon color="primary" />
                                        ) : startDate ? (
                                            <LoopIcon color="primary" />
                                        ) : (
                                            <HourglassEmptyIcon color="primary" />
                                        )}
                                    </TableCell>
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
        </Loading>
    );
}
export default TournamentList;
