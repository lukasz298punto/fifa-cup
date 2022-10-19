import { useTheme } from '@emotion/react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Divider, Grid, IconButton, TextField, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import clsx from 'clsx';
import { PlayerPicker } from 'components/PlayerPicker';
import { RoundAddButton } from 'components/RoundAddButton';
import { findPlayerNameById, parseInputNumber } from 'helpers/global';
import { useActivePlayerListQuery, useIsLogged } from 'hooks';
import { forEach, get, range } from 'lodash';
import 'lodash.combinations';
import React, { useCallback, useState } from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';
import { PlayerResult, Result, TournamentSchema, TypeOfWin } from 'types/global';

type FormResult = Result & { formId: string };

type Props = {
    control: Control<TournamentSchema, any>;
    result: FormResult;
    onAdd?: (result: Result) => void;
    typeOfWin?: TypeOfWin;
    disabledPlayers?: string[];
    formName: any;
    isGroup?: boolean;
};

function ScoreRow({
    control,
    result,
    onAdd,
    typeOfWin,
    disabledPlayers,
    formName,
    isGroup = false,
}: Props) {
    const { data } = useActivePlayerListQuery();
    const { t } = useTranslation();
    const [teamAOpen, setTeamAOpen] = useState(false);
    const [teamBOpen, setTeamBOpen] = useState(false);
    const [teamARefreshOpen, setTeamARefreshOpen] = useState(false);
    const [teamBRefreshOpen, setTeamBRefreshOpen] = useState(false);
    const isLogged = useIsLogged();
    const theme = useTheme();
    const matches = useMediaQuery(get(theme, 'breakpoints').down('sm'));

    const handleTeamAClose = useCallback(() => {
        setTeamAOpen(false);
    }, []);

    const handleTeamBClose = useCallback(() => {
        setTeamBOpen(false);
    }, []);

    const handleTeamARefreshClose = useCallback(() => {
        setTeamARefreshOpen(false);
    }, []);

    const handleTeamBRefreshClose = useCallback(() => {
        setTeamBRefreshOpen(false);
    }, []);

    const getFormName = (name: string): any => `${formName}.${name}`;

    const teamA = useWatch({
        control,
        name: getFormName('playerA'),
    }) as PlayerResult;

    const teamB = useWatch({
        control,
        name: getFormName('playerB'),
    }) as PlayerResult;

    const getCountOfMatches = () =>
        match(typeOfWin)
            .with(TypeOfWin.TwoMatch, () => 1)
            .otherwise(() => 0);

    const addMatch = (teamAId?: string, teamBId?: string) => {
        if (teamAId && teamBId && onAdd) {
            forEach(range(0, getCountOfMatches()), () => {
                onAdd({
                    playerA: { id: teamAId, score: '' },
                    playerB: { id: teamBId, score: '' },
                });
            });
        }
    };

    const disabled = !teamA?.id || !teamB?.id;

    return (
        <>
            <Grid container className="py-1 items-center" wrap="nowrap">
                <Grid item xs={5} className="flex justify-end items-center">
                    <Controller
                        defaultValue={result.playerA.id}
                        name={getFormName('playerA.id')}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <span className="text-xs break-words text-right">
                                {!value && isLogged ? (
                                    <>
                                        <RoundAddButton
                                            onAdd={() => {
                                                setTeamAOpen(true);
                                            }}
                                        />
                                        <PlayerPicker
                                            onClose={handleTeamAClose}
                                            open={teamAOpen}
                                            onPick={(player) => {
                                                onChange(player.id);
                                                addMatch(player.id, teamB?.id);
                                            }}
                                            disabledPlayers={disabledPlayers}
                                        />
                                    </>
                                ) : (
                                    <span
                                        className={clsx(
                                            matches ? 'flex-col items-end' : 'flex  items-center',
                                            'flex'
                                        )}
                                    >
                                        {!isGroup && isLogged && (
                                            <>
                                                <PlayerPicker
                                                    onClose={handleTeamARefreshClose}
                                                    open={teamARefreshOpen}
                                                    onPick={(player) => {
                                                        onChange(player.id);
                                                        handleTeamARefreshClose();
                                                    }}
                                                />
                                                <IconButton
                                                    className="p-0"
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => {
                                                        setTeamARefreshOpen(true);
                                                    }}
                                                >
                                                    <RefreshIcon />
                                                </IconButton>
                                            </>
                                        )}
                                        <span
                                            className={clsx(matches && !isGroup && 'max-w-[50px]')}
                                        >
                                            {findPlayerNameById(value, data?.docs)}
                                        </span>
                                    </span>
                                )}
                            </span>
                        )}
                    />
                    {!isGroup && (
                        <Controller
                            defaultValue={result.playerB.penaltyScore || ''}
                            name={getFormName('playerA.penaltyScore')}
                            control={control}
                            render={({ field: { onChange, value } }) =>
                                isLogged ? (
                                    <TextField
                                        disabled={disabled}
                                        inputProps={{
                                            className: 'p-1 text-center text-xs',
                                        }}
                                        value={value}
                                        onChange={(e) => {
                                            onChange(parseInputNumber(e.target.value));
                                        }}
                                        className="mx-1 w-8"
                                        size="small"
                                        type="number"
                                        variant="filled"
                                        placeholder={t('kr.')}
                                    />
                                ) : (
                                    <span className="text-xs ml-1 mb-[7px] -mr-[3px] opacity-15">
                                        {value}
                                    </span>
                                )
                            }
                        />
                    )}
                </Grid>
                <Grid item>
                    <Box className="flex flex-nowrap">
                        <Controller
                            defaultValue={result.playerA.score}
                            name={getFormName('playerA.score')}
                            control={control}
                            render={({ field: { onChange, value } }) =>
                                isLogged ? (
                                    <TextField
                                        autoComplete="off"
                                        disabled={disabled}
                                        inputProps={{
                                            className: 'p-1 text-center',
                                        }}
                                        value={value}
                                        onChange={(e) => {
                                            onChange(parseInputNumber(e.target.value));
                                        }}
                                        className="mx-1 w-8"
                                        size="small"
                                        type="number"
                                        variant="outlined"
                                    />
                                ) : (
                                    <span className="mx-1 font-bold">{value}</span>
                                )
                            }
                        />
                        :
                        <>
                            <Controller
                                defaultValue={result.playerB.score}
                                name={getFormName('playerB.score')}
                                control={control}
                                render={({ field: { onChange, value } }) =>
                                    isLogged ? (
                                        <TextField
                                            autoComplete="off"
                                            disabled={disabled}
                                            inputProps={{
                                                className: 'p-1 text-center',
                                            }}
                                            value={value}
                                            onChange={(e) => {
                                                onChange(parseInputNumber(e.target.value));
                                            }}
                                            className="mx-1 w-8"
                                            size="small"
                                            type="number"
                                            variant="outlined"
                                        />
                                    ) : (
                                        <span className="mx-1 font-bold">{value}</span>
                                    )
                                }
                            />
                        </>
                    </Box>
                </Grid>
                <Grid item className="flex justify-start items-center" xs={5}>
                    {!isGroup && (
                        <Controller
                            defaultValue={result.playerB.penaltyScore || ''}
                            name={getFormName('playerB.penaltyScore')}
                            control={control}
                            render={({ field: { onChange, value } }) =>
                                isLogged ? (
                                    <TextField
                                        autoComplete="off"
                                        disabled={disabled}
                                        inputProps={{
                                            className: 'p-1 text-center text-xs',
                                        }}
                                        value={value}
                                        onChange={(e) => {
                                            onChange(parseInputNumber(e.target.value));
                                        }}
                                        className="mx-1 w-8"
                                        size="small"
                                        type="number"
                                        variant="filled"
                                        placeholder={t('kr.')}
                                    />
                                ) : (
                                    <span className="text-xs mr-1 mb-[7px] -ml-[3px] opacity-15">
                                        {value}
                                    </span>
                                )
                            }
                        />
                    )}
                    <Controller
                        defaultValue={result.playerB.id}
                        name={getFormName('playerB.id')}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <span className="text-xs break-words">
                                {!value && isLogged ? (
                                    <>
                                        <RoundAddButton
                                            onAdd={() => {
                                                setTeamBOpen(true);
                                            }}
                                        />
                                        <PlayerPicker
                                            onClose={handleTeamBClose}
                                            open={teamBOpen}
                                            onPick={(player) => {
                                                onChange(player.id);
                                                addMatch(teamA?.id, player.id);
                                            }}
                                            disabledPlayers={disabledPlayers}
                                        />
                                    </>
                                ) : (
                                    <span
                                        className={clsx(
                                            matches ? 'flex-col items-start' : 'flex  items-center',
                                            'flex'
                                        )}
                                    >
                                        <span
                                            className={clsx(
                                                matches && !isGroup && 'order-1 max-w-[50px]'
                                            )}
                                        >
                                            {findPlayerNameById(value, data?.docs)}
                                        </span>
                                        {!isGroup && isLogged && (
                                            <>
                                                <PlayerPicker
                                                    onClose={handleTeamBRefreshClose}
                                                    open={teamBRefreshOpen}
                                                    onPick={(player) => {
                                                        onChange(player.id);
                                                        handleTeamBRefreshClose();
                                                    }}
                                                />
                                                <IconButton
                                                    className="p-0"
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => {
                                                        setTeamBRefreshOpen(true);
                                                    }}
                                                >
                                                    <RefreshIcon />
                                                </IconButton>
                                            </>
                                        )}
                                    </span>
                                )}
                            </span>
                        )}
                    />
                </Grid>
            </Grid>
            <Divider />
        </>
    );
}
export default React.memo(ScoreRow);
