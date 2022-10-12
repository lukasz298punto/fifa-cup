import {
    Alert,
    Button,
    ButtonGroup,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { PlayerPicker } from 'components/PlayerPicker';
import { RoundAddButton } from 'components/RoundAddButton';
import { ScoreRow, ScoreTable } from 'components/ScoreTable';
import { findPlayerNameById } from 'helpers/global';
import { useActivePlayerListQuery, useSchemaQuery, useUpdateTournamentMutation } from 'hooks';
import { combinations, compact, concat, filter, isEmpty, map, range } from 'lodash';
import 'lodash.combinations';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Controller,
    SubmitErrorHandler,
    SubmitHandler,
    useFieldArray,
    useForm,
    useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDebounce, useUpdateEffect } from 'react-use';
import { GroupStageType, Player, TournamentSchema, TypeOfWin } from 'types/global';
import SaveIcon from '@mui/icons-material/Save';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { useTournamentQuery } from 'hooks';
import { useParams } from 'react-router-dom';
import { Loading } from 'components/Loading';
import { CupPhase, GroupsPhase } from 'Modules/Tournament';
import { TabPanel } from 'components/TabPanel';
import { format } from 'date-fns';
import { dateTimeFormat } from 'constants/global';

enum UpdateType {
    End,
    Update,
    Start,
}

function TournamentDetail() {
    const { id } = useParams<{ id: string }>();
    const [tab, setTab] = useState('0');
    const { mutate, isLoading } = useUpdateTournamentMutation(id as string);
    const { t } = useTranslation();

    const { data: tournamentData, isLoading: tournamentIsLoading } = useTournamentQuery(
        id as string
    );

    const tournament = useMemo(() => {
        return tournamentData?.data();
    }, [tournamentData]);

    console.log(tournament, 'tournamentData');

    const { data: schemaData, isLoading: schemaIsLoading } = useSchemaQuery(tournament?.schemaId);

    const schema = useMemo(() => {
        return schemaData?.data();
    }, [schemaData]);

    const { control, handleSubmit, reset, register, setValue, watch } = useForm<TournamentSchema>();

    const phases = useWatch({
        control,
        name: 'phases',
    });

    console.log(tournament, 'tournament');

    useEffect(() => {
        if (tournament && schema) {
            if (tournament?.phases) {
                reset(tournament);
            } else {
                reset({
                    ...tournament,
                    phases: map(schema?.phases, (phase) => {
                        if (phase.isGroupStage === GroupStageType.GroupStage) {
                            return {
                                groups: map(phase?.groups, (group) => ({
                                    players: map(range(0, group.playerCount), () => ({
                                        id: '',
                                        firstName: '',
                                        lastName: '',
                                    })),
                                    results: [],
                                })),
                            };
                        } else {
                            return {
                                results: map(range(0, Number(phase.pairCount) || 0), () => ({
                                    playerA: { id: '', score: '' },
                                    playerB: { id: '', score: '' },
                                })),
                            };
                        }
                    }),
                });
            }
        }
        return () => {
            console.log('Noniec');
        };
    }, [reset, tournament, schema]);

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    const handleOnSubmit = useCallback(
        (type: UpdateType = UpdateType.Update) =>
            () => {
                handleSubmit(
                    async (data) => {
                        mutate({
                            ...data,
                            startDate:
                                type === UpdateType.Start
                                    ? format(new Date(), dateTimeFormat)
                                    : data.startDate,
                            endDate:
                                type === UpdateType.End
                                    ? format(new Date(), dateTimeFormat)
                                    : data.endDate,
                        });
                        console.log(data, 'data');
                    },
                    (data) => {
                        console.log(data);
                    }
                )();
            },
        [handleSubmit, mutate]
    );

    useDebounce(
        () => {
            if (tournament && schema) {
                handleOnSubmit()();
            }
            console.log('odpalamy');
        },
        3000,
        [phases]
    );

    if (tournamentIsLoading || schemaIsLoading) {
        return <CircularProgress size={24} />;
    }

    return (
        <Paper>
            <Tabs value={tab} onChange={handleChange} variant="scrollable">
                {map(schema?.phases, (value, index) => (
                    <Tab label={value.name} value={String(index)} key={index} />
                ))}
            </Tabs>
            {schema &&
                map(schema?.phases, (value, index) => (
                    <TabPanel value={tab} index={String(index)} className="p-3" key={index}>
                        {value.isGroupStage === GroupStageType.Cup ? (
                            <CupPhase schema={schema} index={index} control={control} />
                        ) : (
                            <GroupsPhase schema={schema} index={index} control={control} />
                        )}
                    </TabPanel>
                ))}
            <Box className="px-6 pb-4">
                {tournament?.startDate && !tournament?.endDate && (
                    <Button
                        onClick={handleOnSubmit(UpdateType.End)}
                        startIcon={<StopCircleIcon />}
                        color="primary"
                        children={t('Zakończ turniej')}
                    />
                )}
                {!tournament?.startDate && !tournament?.endDate && (
                    <Button
                        onClick={handleOnSubmit(UpdateType.Start)}
                        startIcon={<PlayCircleFilledWhiteIcon />}
                        color="primary"
                        children={t('Wystartuj turniej')}
                    />
                )}
            </Box>
        </Paper>
    );
}
export default TournamentDetail;
