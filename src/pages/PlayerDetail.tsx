import { Grid, Paper, TableBody, TableHead, TableRow, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import { Title } from 'components/Title';
import { useAllCompletedTournamentListQuery, usePlayerQuery } from 'hooks';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { TableCell } from 'style/components';

function PlayerDetail() {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = usePlayerQuery(id as string);
    const { data: tournamentData, isLoading: tournamentDataIsLoading } =
        useAllCompletedTournamentListQuery();
    const { t } = useTranslation();

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={4} md={2}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Title>{t('Z')}</Title>
                        <Typography variant="h4" className="font-bold">
                            2
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={4} md={2}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Title>{t('R')}</Title>
                        <Typography variant="h4" className="font-bold">
                            2
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={4} md={2}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Title>{t('P')}</Title>
                        <Typography variant="h4" className="font-bold">
                            2
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Title>{t('Br+')}</Title>
                        <Typography variant="h4" className="font-bold">
                            2
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Title>{t('Br-')}</Title>
                        <Typography variant="h4" className="font-bold">
                            2
                        </Typography>
                    </Paper>
                </Grid>
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
                                    <TableCell width={10}>{t('Pozycja')}</TableCell>
                                    <TableCell>{t('Nazwa turnieju')}</TableCell>
                                    <TableCell>{t('Data zakończenia turnieju')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow key={1}>
                                    <TableCell>{1}</TableCell>
                                    <TableCell>{'test123'}</TableCell>
                                    <TableCell>{'2020-01-01-02'}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}
export default PlayerDetail;
