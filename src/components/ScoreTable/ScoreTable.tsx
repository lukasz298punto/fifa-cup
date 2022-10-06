import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import {
    Alert,
    Button,
    ButtonGroup,
    Divider,
    Grid,
    IconButton,
    Paper,
    TextField,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { blue, green, red } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { PlayerPicker } from 'components/PlayerPicker';
import { TableContainer } from 'components/TableContainer';
import {
    combinations,
    compact,
    concat,
    filter,
    flatMap,
    isEmpty,
    map,
    range,
    reduce,
    size,
} from 'lodash';
import 'lodash.combinations';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, FieldArrayWithId, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useUpdateEffect } from 'react-use';
import { TableCell } from 'style/components';
import { Player, Result, TournamentSchema } from 'types/global';

type ScoreResult = [string, string, number, number, number, number, number, number, number, number];

type Props = {
    players: FieldArrayWithId<TournamentSchema, 'players', 'formId'>[];
    results: Result[];
    promotion: number;
    onAddPlayer: (index: number) => void;
    className?: string;
};

const status = {
    L: 'L',
    D: 'D',
    W: 'W',
} as const;

type MatchResult = {
    status: keyof typeof status;
    plus: number;
    minus: number;
    diff: number;
    pkt: number;
};

function ScoreTable({ players, promotion, onAddPlayer, results, className }: Props) {
    const { t } = useTranslation();

    const getStatus = (score: number) => {
        if (score === 0) return status.D;

        return score > 0 ? status.W : status.L;
    };

    const getPkt = (score: number) => {
        if (score === 0) return 1;

        return score > 0 ? 3 : 0;
    };

    const getAllResultsByPlayerId = (id: string) =>
        reduce(
            results,
            (acc: MatchResult[], current) => {
                if (current.playerA.score && current.playerB.score) {
                    if (current.playerA.id === id) {
                        return concat(acc, {
                            status: getStatus(
                                parseInt(current.playerA.score) - parseInt(current.playerB.score)
                            ),
                            plus: parseInt(current.playerA.score),
                            minus: parseInt(current.playerB.score),
                            diff: parseInt(current.playerA.score) - parseInt(current.playerB.score),
                            pkt: getPkt(
                                parseInt(current.playerA.score) - parseInt(current.playerB.score)
                            ),
                        });
                    }

                    if (current.playerB.id === id) {
                        return concat(acc, {
                            status: getStatus(
                                parseInt(current.playerB.score) - parseInt(current.playerA.score)
                            ),
                            plus: parseInt(current.playerB.score),
                            minus: parseInt(current.playerA.score),
                            diff: parseInt(current.playerB.score) - parseInt(current.playerA.score),
                            pkt: getPkt(
                                parseInt(current.playerB.score) - parseInt(current.playerA.score)
                            ),
                        });
                    }
                }

                return acc;
            },
            []
        );

    const result = useMemo<ScoreResult[]>(() => {
        if (isEmpty(results)) {
            return map(players, (player) => [
                player.formId,
                player.id || '',
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
            ]);
        }
        return map(players, (player) => {
            const r = getAllResultsByPlayerId(player.id as string);

            console.log(r, player.id);

            return [
                player.formId,
                player.id || '',
                0,
                size(r),
                size(filter(r, { status: status.W })),
                size(filter(r, { status: status.D })),
                size(filter(r, { status: status.L })),
                0,
                0,
                0,
            ];
        });
    }, [results, players, getAllResultsByPlayerId]);

    // /NE3iRRYyKdUrqmfBdKRD

    // const ttt = ;
    // console.log(result, 'result');
    // console.log(ttt, 'ttt');

    // [{status: 'W', scorePlus: 2, scoreMinus: 1}]

    return (
        <TableContainer className={className}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="left">{t('Zawodnik')}</TableCell>
                        <TableCell width={50} className="text-center">
                            {t('Pkt')}
                        </TableCell>
                        <TableCell width={50} className="text-center">
                            {t('M')}
                        </TableCell>
                        <TableCell width={50} className="text-center">
                            {t('W')}
                        </TableCell>
                        <TableCell width={50} className="text-center">
                            {t('R')}
                        </TableCell>
                        <TableCell width={50} className="text-center">
                            {t('P')}
                        </TableCell>
                        <TableCell width={50} className="text-center">
                            {t('Br+')}
                        </TableCell>
                        <TableCell width={50} className="text-center">
                            {t('Br-')}
                        </TableCell>
                        <TableCell width={50} className="text-center">
                            {t('+/-')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {map(
                        result,
                        ([formId, id, pkt, m, w, r, p, brPlus, brMinus, plusAndMinus], index) => (
                            <TableRow
                                key={formId}
                                style={{
                                    backgroundColor: promotion > index ? green[100] : red[100],
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {id ? (
                                        id
                                    ) : (
                                        <IconButton
                                            className="p-0"
                                            size="small"
                                            color="primary"
                                            onClick={() => onAddPlayer(index)}
                                        >
                                            <AddCircleIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                                <TableCell
                                    component="th"
                                    scope="row"
                                    className="text-center font-bold"
                                >
                                    {pkt}
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    {m}
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    {w}
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    {r}
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    {p}
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    {brPlus}
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    {brMinus}
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    {plusAndMinus}
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default React.memo(ScoreTable);
