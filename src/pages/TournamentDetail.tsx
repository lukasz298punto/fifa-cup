import { Alert, Button, ButtonGroup, Divider, Grid, Paper, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { PlayerPicker } from 'components/PlayerPicker';
import { RoundAddButton } from 'components/RoundAddButton';
import { ScoreRow, ScoreTable } from 'components/ScoreTable';
import { findPlayerNameById } from 'helpers/global';
import { useActivePlayerListQuery, useSchemaQuery } from 'hooks';
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
import { useUpdateEffect } from 'react-use';
import { GroupStageType, Player, TournamentSchema, TypeOfWin } from 'types/global';
import SaveIcon from '@mui/icons-material/Save';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { useTournamentQuery } from 'hooks';
import { useParams } from 'react-router-dom';
import { Loading } from 'components/Loading';
import { CupPhase, GroupsPhase } from 'Modules/Tournament';
import { TabPanel } from 'components/TabPanel';

const isTwoMatch = false;

const schema123 = {
    playerCount: 3,
    promotion: 1,
    typeOfWin: TypeOfWin.OneMatch,
};

function TournamentDetail() {
    const { id } = useParams<{ id: string }>();
    const [tab, setTab] = useState('0');

    const { data: tournamentData, isLoading: tournamentIsLoading } = useTournamentQuery(
        id as string
    );
    const tournament = tournamentData?.data();
    const { data: schemaData, isLoading: schemaIsLoading } = useSchemaQuery(tournament?.schemaId);
    const schema = schemaData?.data();

    const { control, handleSubmit, reset, register, setValue, watch } = useForm<TournamentSchema>();

    useEffect(() => {
        if (tournament?.phases) {
            reset(tournament);
        } else {
            reset({
                ...tournament,
                phases: [
                    {
                        groups: [
                            {
                                players: map(range(0, 3), () => ({
                                    id: '',
                                    firstName: '',
                                    lastName: '',
                                })),
                                results: [],
                            },
                        ],
                    },
                    {
                        results: [
                            { playerA: { id: '', score: '' }, playerB: { id: '', score: '' } },
                        ],
                    },
                ],
            });
        }
    }, [reset, tournamentData]);

    const { t } = useTranslation();

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    const onSubmit = useCallback<SubmitHandler<TournamentSchema>>(async (data) => {
        console.log(data, 'data');
    }, []);

    const onError = useCallback<SubmitErrorHandler<TournamentSchema>>((data) => {
        console.log(data);
    }, []);

    const handleOnSubmit = useCallback(() => {
        handleSubmit(onSubmit, onError)();
    }, [handleSubmit, onSubmit, onError]);

    return (
        <Loading loading={tournamentIsLoading || schemaIsLoading}>
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
                            onClick={() => {}}
                            startIcon={<StopCircleIcon />}
                            color="primary"
                            children={t('Zakończ turniej')}
                        />
                    )}
                    {!tournament?.startDate && !tournament?.endDate && (
                        <Button
                            onClick={handleOnSubmit}
                            startIcon={<PlayCircleFilledWhiteIcon />}
                            color="primary"
                            children={t('Wystartuj turniej')}
                        />
                    )}
                </Box>
            </Paper>
        </Loading>
        // </>
    );
}
export default TournamentDetail;
