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
import { matchStatus } from 'constants/global';
import { where } from 'firebase/firestore';
import { findPlayerNameById, getMatchStatus, getPkt } from 'helpers/global';
import { usePlayerListQuery } from 'hooks';
import {
    combinations,
    compact,
    concat,
    filter,
    find,
    flatMap,
    isEmpty,
    map,
    orderBy,
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

type ScoreResult = {
    formId: string;
    id: string;
    pkt: number;
    m: number;
    w: number;
    r: number;
    p: number;
    brPlus: number;
    brMinus: number;
    brDiff: number;
};

type Props = {
    players: FieldArrayWithId<TournamentSchema, 'players', 'formId'>[];
    results: Result[];
    promotion: number;
    onAddPlayer: (index: number) => void;
    className?: string;
};

type MatchResult = {
    status: keyof typeof matchStatus;
    plus: number;
    minus: number;
    diff: number;
    pkt: number;
};

function ScoreTable({ players, promotion, onAddPlayer, results, className }: Props) {
    const { t } = useTranslation();
    const { data } = usePlayerListQuery([where('active', '==', 1)]);

    const findPlayerById = (id: string) => find(data?.docs, { id: id })?.data();

    const getAllResultsByPlayerId = useCallback(
        (id: string) =>
            reduce(
                results,
                (acc: MatchResult[], { playerA, playerB }) => {
                    if (playerA.score && playerB.score) {
                        if (playerA.id === id) {
                            return concat(acc, {
                                status: getMatchStatus(
                                    parseInt(playerA.score) - parseInt(playerB.score)
                                ),
                                plus: parseInt(playerA.score),
                                minus: parseInt(playerB.score),
                                diff: parseInt(playerA.score) - parseInt(playerB.score),
                                pkt: getPkt(parseInt(playerA.score) - parseInt(playerB.score)),
                            });
                        }

                        if (playerB.id === id) {
                            return concat(acc, {
                                status: getMatchStatus(
                                    parseInt(playerB.score) - parseInt(playerA.score)
                                ),
                                plus: parseInt(playerB.score),
                                minus: parseInt(playerA.score),
                                diff: parseInt(playerB.score) - parseInt(playerA.score),
                                pkt: getPkt(parseInt(playerB.score) - parseInt(playerA.score)),
                            });
                        }
                    }

                    return acc;
                },
                []
            ),
        [results]
    );

    const result = useMemo<ScoreResult[]>(() => {
        if (isEmpty(results)) {
            return map(players, (player) => ({
                formId: player.formId,
                id: player.id || '',
                pkt: 0,
                m: 0,
                w: 0,
                r: 0,
                p: 0,
                brPlus: 0,
                brMinus: 0,
                brDiff: 0,
            }));
        }

        const resultList = map(players, (player) => {
            const playerResult = getAllResultsByPlayerId(player.id as string);

            return {
                formId: player.formId,
                id: player.id || '',
                pkt: reduce(playerResult, (acc, { pkt }) => acc + pkt, 0),
                m: size(playerResult),
                w: size(filter(playerResult, { status: matchStatus.W })),
                r: size(filter(playerResult, { status: matchStatus.D })),
                p: size(filter(playerResult, { status: matchStatus.L })),
                brPlus: reduce(playerResult, (acc, { plus }) => acc + plus, 0),
                brMinus: reduce(playerResult, (acc, { minus }) => acc + minus, 0),
                brDiff: reduce(playerResult, (acc, { diff }) => acc + diff, 0),
            };
        });

        return orderBy(resultList, ['pkt', 'brDiff', 'brPlus'], ['desc', 'desc', 'desc']);
    }, [results, players, getAllResultsByPlayerId]);

    // formId, id, pkt, m, w, r, p, brPlus, brMinus, plusAndMinus;

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
                        ({ formId, id, pkt, m, w, r, p, brPlus, brMinus, brDiff }, index) => (
                            <TableRow
                                key={formId}
                                style={{
                                    backgroundColor: promotion > index ? green[100] : red[100],
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {id ? (
                                        findPlayerNameById(id, data?.docs)
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
                                    {brDiff}
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
