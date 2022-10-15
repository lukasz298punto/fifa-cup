import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { IconButton, Typography } from '@mui/material';
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
import {
    useActivePlayerListQuery,
    useConfigQuery,
    useStoreSchemaMutation,
    useUpdateConfigMutation,
} from 'hooks';
import useTournamentListQuery from 'hooks/useTournamentListQuery';
import { map } from 'lodash';
import { LastTournament } from 'Modules/Home';
import TopPlayers from 'Modules/Home/TopPlayers';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TableCell } from 'style/components';
import { Config, Tournament } from 'types/global';
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { dateFormat } from 'constants/global';
import { format } from 'date-fns';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useUpdateEffect } from 'react-use';
import SaveIcon from '@mui/icons-material/Save';
import { Loading } from 'components/Loading';
import { Box } from '@mui/system';

function Home() {
    const [value, setValue] = React.useState<Date | null>(null);
    const { data } = useConfigQuery();
    const { mutate, isLoading } = useUpdateConfigMutation();
    const { t } = useTranslation();
    const { control, handleSubmit, reset, trigger, getValues } = useForm<{
        nextTournamentDate: Date | null;
    }>();

    console.log(value, 'value');

    const nextTournamentDate = useWatch({
        control,
        name: `nextTournamentDate`,
    });

    // const handleChange = useCallback(
    //     (newValue: Date | null) => {
    //         setValue(newValue);

    //         mutate({ nextTournamentDate: newValue ? format(newValue, dateFormat) : null });
    //     },
    //     [mutate]
    // );

    // useUpdateEffect(() => {
    //     mutate({
    //         nextTournamentDate: nextTournamentDate ? format(nextTournamentDate, dateFormat) : null,
    //     });
    // }, [nextTournamentDate]);

    useEffect(() => {
        const date = data?.data()?.nextTournamentDate;

        if (data) {
            reset({ nextTournamentDate: date ? new Date(date) : null });
        }
    }, [data, reset]);

    return (
        <Grid container spacing={3}>
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
                            <Title>{t('Następny turniej')}</Title>

                            <Loading loading={isLoading}>
                                <Box className="items-center flex">
                                    <Controller
                                        name="nextTournamentDate"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <MobileDatePicker
                                                {...field}
                                                loading={isLoading}
                                                className="w-32"
                                                inputFormat={dateFormat}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        )}
                                    />

                                    <IconButton
                                        color="primary"
                                        size="small"
                                        disabled={isLoading}
                                        onClick={() => {
                                            mutate({
                                                nextTournamentDate: nextTournamentDate
                                                    ? format(nextTournamentDate, dateFormat)
                                                    : null,
                                            });
                                        }}
                                    >
                                        <SaveIcon />
                                    </IconButton>
                                </Box>
                            </Loading>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <LastTournament />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
                <TopPlayers />
            </Grid>
            <Grid item xs={12} md={4} lg={3}></Grid>
        </Grid>
    );
}
export default Home;
