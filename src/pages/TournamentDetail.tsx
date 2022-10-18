import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import SaveIcon from '@mui/icons-material/Save';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { Button, CircularProgress, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Loading } from 'components/Loading';
import { TabPanel } from 'components/TabPanel';
import { dateTimeFormat } from 'constants/global';
import { format } from 'date-fns';
import {
    useIsLogged,
    useSchemaQuery,
    useTournamentQuery,
    useUpdateTournamentMutation,
} from 'hooks';
import { map, range } from 'lodash';
import 'lodash.combinations';
import { CupPhase, GroupsPhase } from 'Modules/Tournament';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { GroupStageType, TournamentSchema } from 'types/global';

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

    const isLogged = useIsLogged();

    const { data: tournamentData, isLoading: tournamentIsLoading } = useTournamentQuery(
        id as string
    );

    const tournament = useMemo(() => {
        return tournamentData?.data();
    }, [tournamentData]);

    const { data: schemaData, isLoading: schemaIsLoading } = useSchemaQuery(tournament?.schemaId);

    const schema = useMemo(() => {
        return schemaData?.data();
    }, [schemaData]);

    const { control, handleSubmit, reset } = useForm<TournamentSchema>();

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
    }, [reset, tournament, schema]);

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    const handleOnSubmit = useCallback(
        (type: UpdateType = UpdateType.Update) =>
            () => {
                handleSubmit(
                    async (data) => {
                        console.log(data);
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

    if (tournamentIsLoading || schemaIsLoading) {
        return <CircularProgress size={24} />;
    }

    return (
        <>
            <Box>
                <EmojiEventsIcon className="text-xs mr-1" />
                <span className="text-xs">{tournament?.name}</span>
                {tournament?.endDate && <span className="text-xs ml-1">({t('Zakończony')})</span>}
            </Box>
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
                <Box className="px-6 pb-4 flex">
                    {isLogged && tournament?.startDate && !tournament?.endDate && (
                        <Button
                            onClick={handleOnSubmit(UpdateType.End)}
                            startIcon={<StopCircleIcon />}
                            color="primary"
                            children={t('Zakończ turniej')}
                        />
                    )}
                    {isLogged && !tournament?.startDate && !tournament?.endDate && (
                        <Button
                            onClick={handleOnSubmit(UpdateType.Start)}
                            startIcon={<PlayCircleFilledWhiteIcon />}
                            color="primary"
                            children={t('Wystartuj turniej')}
                        />
                    )}
                    {isLogged && (
                        <Loading loading={isLoading}>
                            <Button
                                onClick={handleOnSubmit()}
                                startIcon={<SaveIcon />}
                                color="primary"
                                children={t('Zapisz zmiany')}
                            />
                        </Loading>
                    )}
                </Box>
            </Paper>
        </>
    );
}
export default TournamentDetail;
