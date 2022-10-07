import { Alert, Button, ButtonGroup, Divider, Grid, Paper, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { PlayerPicker } from 'components/PlayerPicker';
import { ScoreTable } from 'components/ScoreTable';
import { findPlayerNameById } from 'helpers/global';
import { useActivePlayerListQuery } from 'hooks';
import { combinations, compact, filter, isEmpty, map, range } from 'lodash';
import 'lodash.combinations';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useUpdateEffect } from 'react-use';
import { Player, TournamentSchema } from 'types/global';

interface TabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: string;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
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
};

function TournamentDetail() {
    const [value] = useState('Faza grupowa');

    const { data } = useActivePlayerListQuery();

    const [open, setOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState<number | null>(null);

    const handleClickOpen = useCallback((index: number) => {
        setModalIndex(index);
        setOpen(true);
    }, []);

    const { control, handleSubmit, reset, register, setValue } = useForm<TournamentSchema>();

    const {
        fields: players,
        append,
        prepend,
        remove,
        swap,
        move,
        insert,
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

    useEffect(() => {
        reset({
            players: map(range(0, schema.playerCount), () => ({
                id: '',
                firstName: '',
                lastName: '',
            })),
            results: [],
        });
    }, [reset]);

    useUpdateEffect(() => {
        if (isEmpty(filter(players, (field) => !field.id))) {
            resultsReplace(
                map(combinations(players, 2), ([teamA, teamB]) => ({
                    playerA: { id: teamA.id || '', score: '' },
                    playerB: { id: teamB.id || '', score: '' },
                }))
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

    const { t } = useTranslation();

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
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
                <Tabs value={'Faza grupowa'} onChange={handleChange} variant="scrollable">
                    <Tab label="Faza grupowa" value="Faza grupowa" />
                    <Tab label="1/8" value="1/8" />
                    <Tab label="1/4" value="1/4" />
                    <Tab label="1/2" value="1/2" />
                    <Tab label="mecz o 3." value="mecz o 3." />
                    <Tab label="Finał" value="Finał" />
                </Tabs>
                {/* </Box> */}
                <TabPanel value={value} index={'Faza grupowa'}>
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
                                    <>
                                        <Grid container className="py-1 items-center" wrap="nowrap">
                                            <Grid
                                                item
                                                xs={5}
                                                className="flex justify-end items-center"
                                            >
                                                <Controller
                                                    defaultValue={result.playerA.id}
                                                    name={`results.${index}.playerA.id`}
                                                    control={control}
                                                    render={({
                                                        field: { value },
                                                        fieldState: { error },
                                                    }) => (
                                                        <span className="text-xs break-all">
                                                            {findPlayerNameById(value, data?.docs)}
                                                        </span>
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Box className="flex flex-nowrap">
                                                    <Controller
                                                        defaultValue={result.playerA.score}
                                                        name={`results.${index}.playerA.score`}
                                                        control={control}
                                                        render={({
                                                            field,
                                                            fieldState: { error },
                                                        }) => (
                                                            <TextField
                                                                inputProps={{
                                                                    className: 'p-1 text-center',
                                                                }}
                                                                {...field}
                                                                className="mx-1 w-10"
                                                                size="small"
                                                                id="outlined-basic"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                    />
                                                    :
                                                    <Controller
                                                        defaultValue={result.playerB.score}
                                                        name={`results.${index}.playerB.score`}
                                                        control={control}
                                                        render={({
                                                            field,
                                                            fieldState: { error },
                                                        }) => (
                                                            <TextField
                                                                inputProps={{
                                                                    className: 'p-1 text-center',
                                                                }}
                                                                {...field}
                                                                className="mx-1 w-10"
                                                                size="small"
                                                                id="outlined-basic"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid
                                                item
                                                className="flex justify-start items-center"
                                                xs={5}
                                            >
                                                <Controller
                                                    defaultValue={result.playerB.id}
                                                    name={`results.${index}.playerB.id`}
                                                    control={control}
                                                    render={({
                                                        field: { value },
                                                        fieldState: { error },
                                                    }) => (
                                                        <span className="text-xs break-all">
                                                            {findPlayerNameById(value, data?.docs)}
                                                        </span>
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Divider />
                                    </>
                                )
                        )}
                    </Box>
                </TabPanel>
                <TabPanel value={value} index={'1/8'}>
                    Item Two
                </TabPanel>
                <TabPanel value={value} index={'1/4'}>
                    Item Three
                </TabPanel>
                <TabPanel value={value} index={'1/2'}>
                    Item Three
                </TabPanel>
                <TabPanel value={value} index={'mecz o 3.'}>
                    Item Three
                </TabPanel>
                <TabPanel value={value} index={'Finał'}>
                    Item Three
                </TabPanel>
            </Paper>
        </>
    );
}
export default TournamentDetail;
