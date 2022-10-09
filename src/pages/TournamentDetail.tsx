import { Alert, Button, ButtonGroup, Divider, Grid, Paper, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { PlayerPicker } from 'components/PlayerPicker';
import { RoundAddButton } from 'components/RoundAddButton';
import { ScoreRow, ScoreTable } from 'components/ScoreTable';
import { findPlayerNameById } from 'helpers/global';
import { useActivePlayerListQuery } from 'hooks';
import { combinations, compact, concat, filter, isEmpty, map, range } from 'lodash';
import 'lodash.combinations';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useUpdateEffect } from 'react-use';
import { Player, TournamentSchema, TypeOfWin } from 'types/global';
import SaveIcon from '@mui/icons-material/Save';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';

interface TabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: string;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const isTwoMatch = false;

const schema = {
    playerCount: 3,
    promotion: 1,
    typeOfWin: TypeOfWin.OneMatch,
};

function TournamentDetail() {
    const [tab, setTab] = useState('Faza grupowa');

    const { data } = useActivePlayerListQuery();

    const [open, setOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState<number | null>(null);

    const handleClickOpen = useCallback((index: number) => {
        setModalIndex(index);
        setOpen(true);
    }, []);

    const { control, handleSubmit, reset, register, setValue, watch } = useForm<TournamentSchema>();

    const {
        fields: players,
        append,
        prepend,
        remove,
        swap,
        move,
        update,
    } = useFieldArray({
        control,
        name: 'players',
        keyName: 'formId',
    });

    const { fields: results, replace: resultsReplace } = useFieldArray({
        control,
        name: 'results',
        keyName: 'formId',
    });

    const {
        fields: results2,
        insert,
        append: append2,
    } = useFieldArray({
        control,
        name: 'results2',
        keyName: 'formId',
    });

    useEffect(() => {
        reset({
            players: map(range(0, schema.playerCount), () => ({
                id: '',
                firstName: '',
                lastName: '',
            })),
            results: [],
            results2: [
                { playerA: { id: '', score: '' }, playerB: { id: '', score: '' } },
                { playerA: { id: '', score: '' }, playerB: { id: '', score: '' } },
                { playerA: { id: '', score: '' }, playerB: { id: '', score: '' } },
                { playerA: { id: '', score: '' }, playerB: { id: '', score: '' } },
                { playerA: { id: '', score: '' }, playerB: { id: '', score: '' } },
                { playerA: { id: '', score: '' }, playerB: { id: '', score: '' } },
                { playerA: { id: '', score: '' }, playerB: { id: '', score: '' } },
                { playerA: { id: '', score: '' }, playerB: { id: '', score: '' } },
            ],
        });
    }, [reset]);

    useUpdateEffect(() => {
        if (isEmpty(filter(players, (field) => !field.id))) {
            const baseCombinations = map(combinations(players, 2), ([teamA, teamB]) => ({
                playerA: { id: teamA.id || '', score: '' },
                playerB: { id: teamB.id || '', score: '' },
            }));

            resultsReplace(
                schema.typeOfWin === TypeOfWin.TwoMatch
                    ? concat(
                          baseCombinations,
                          map(baseCombinations, ({ playerA, playerB }) => ({
                              playerA: playerB,
                              playerB: playerA,
                          }))
                      )
                    : baseCombinations
            );
        }
        console.log(players, 'fields');
    }, [players]);

    console.log('results', 'results');

    const resultsValues = useWatch({
        control,
        name: 'results',
    });

    // "my-2"

    console.log(resultsValues, 'resultsValues');
    console.log(players, 'players');

    const { t } = useTranslation();

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
        // setValue(newValue);
    };

    const handleClose = useCallback(() => {
        setModalIndex(null);
        setOpen(false);
    }, []);

    const handlePick = useCallback(
        (player: Player) => {
            update(modalIndex as number, {
                id: player.id,
                firstName: player.firstName,
                lastName: player.lastName,
            });
            handleClose();
        },
        [handleClose, modalIndex, update]
    );

    const disabledPlayers = useMemo(() => {
        return compact(map(players, 'id'));
    }, [players]);

    console.log(results, 'results');
    console.log(results2, 'results2');

    return (
        <>
            <PlayerPicker
                onClose={handleClose}
                open={open}
                onPick={handlePick}
                disabledPlayers={disabledPlayers}
            />
            <Paper>
                {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}> */}
                <Tabs value={tab} onChange={handleChange} variant="scrollable">
                    <Tab label="Faza grupowa" value="Faza grupowa" />
                    <Tab label="1/8" value="1/8" />
                    <Tab label="1/4" value="1/4" />
                    <Tab label="1/2" value="1/2" />
                    <Tab label="mecz o 3." value="mecz o 3." />
                    <Tab label="Finał" value="Finał" />
                </Tabs>
                {/* </Box> */}
                <TabPanel value={tab} index={'Faza grupowa'}>
                    <ButtonGroup variant="outlined">
                        <Button variant="contained" size="small">
                            Grupa A
                        </Button>
                        <Button size="small">Grupa B</Button>
                        <Button size="small">Grupa C</Button>
                    </ButtonGroup>

                    <ScoreTable
                        className="my-2"
                        players={players}
                        onAddPlayer={handleClickOpen}
                        promotion={1}
                        results={resultsValues}
                    />

                    <Box>
                        {isEmpty(results) && (
                            <Alert severity="info" variant="standard">
                                {t('Wprowadź wszystkich graczy aby wygenerować terminarz')}
                            </Alert>
                        )}
                        {/* {map(combinations(fields, 2), ([teamA, teamB], index) => ( */}
                        {map(
                            results,
                            (result, index) =>
                                result.playerA.id &&
                                result.playerB.id && (
                                    <ScoreRow
                                        key={result.formId}
                                        control={control}
                                        index={index}
                                        result={result}
                                    />
                                )
                        )}
                    </Box>
                </TabPanel>
                <TabPanel value={tab} index={'1/8'}>
                    {map(results2, (result, index) => (
                        <ScoreRow
                            disabledPlayers={disabledPlayers}
                            typeOfWin={schema.typeOfWin}
                            control={control}
                            index={index}
                            result={result}
                            key={result.formId}
                            onAdd={(result) => {
                                append2(result);
                            }}
                        />
                    ))}
                </TabPanel>
                <TabPanel value={tab} index={'1/4'}>
                    Item Three
                </TabPanel>
                <TabPanel value={tab} index={'1/2'}>
                    Item Three
                </TabPanel>
                <TabPanel value={tab} index={'mecz o 3.'}>
                    Item Three
                </TabPanel>
                <TabPanel value={tab} index={'Finał'}>
                    Item Three
                </TabPanel>
                <Box className="px-6 pb-4">
                    <Button
                        onClick={() => {}}
                        startIcon={<StopCircleIcon />}
                        color="primary"
                        children={t('Zakończ turniej')}
                    />
                    <Button
                        onClick={() => {}}
                        startIcon={<PlayCircleFilledWhiteIcon />}
                        color="primary"
                        children={t('Wystartuj turniej')}
                    />
                </Box>
            </Paper>
        </>
    );
}
export default TournamentDetail;
