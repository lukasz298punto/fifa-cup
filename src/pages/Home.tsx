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
    useIsLogged,
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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { dateFormat, dateTimeFormat } from 'constants/global';
import { format, isBefore } from 'date-fns';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useUpdateEffect } from 'react-use';
import SaveIcon from '@mui/icons-material/Save';
import { Loading } from 'components/Loading';
import { Box } from '@mui/system';
import { useAuthUser } from '@react-query-firebase/auth';
import { auth } from 'config/firebase';

function Home() {
    const isLogged = useIsLogged();
    const { data } = useConfigQuery();
    const { mutate, isLoading } = useUpdateConfigMutation();
    const { t } = useTranslation();
    const { control, handleSubmit, reset, trigger, getValues } = useForm<{
        nextTournamentDate: Date | null;
    }>();

    const nextTournamentDate = useWatch({
        control,
        name: `nextTournamentDate`,
    });

    useEffect(() => {
        const date = data?.data()?.nextTournamentDate;

        if (data) {
            reset({
                nextTournamentDate: date
                    ? isBefore(new Date(date), new Date())
                        ? null
                        : new Date(date)
                    : null,
            });
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
                                        render={({ field, fieldState: { error } }) =>
                                            isLogged ? (
                                                <DateTimePicker
                                                    {...field}
                                                    loading={isLoading}
                                                    className="w-56"
                                                    inputFormat={dateTimeFormat}
                                                    renderInput={(params) => (
                                                        <TextField {...params} />
                                                    )}
                                                />
                                            ) : (
                                                <span>
                                                    {field.value
                                                        ? format(field.value, dateTimeFormat)
                                                        : t('Jeszcze nie ogłoszono')}
                                                </span>
                                            )
                                        }
                                    />

                                    {isLogged && (
                                        <IconButton
                                            color="primary"
                                            size="small"
                                            disabled={isLoading}
                                            onClick={() => {
                                                mutate({
                                                    nextTournamentDate: nextTournamentDate
                                                        ? format(nextTournamentDate, dateTimeFormat)
                                                        : null,
                                                });
                                            }}
                                        >
                                            <SaveIcon />
                                        </IconButton>
                                    )}
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
