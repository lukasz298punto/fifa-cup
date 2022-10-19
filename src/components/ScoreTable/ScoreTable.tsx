import { green, red } from '@mui/material/colors';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { RoundAddButton } from 'components/RoundAddButton';
import { TableContainer } from 'components/TableContainer';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { getAllPlayersResults } from 'helpers/calculate';
import { findPlayerNameById } from 'helpers/global';
import { isEmpty, map } from 'lodash';
import 'lodash.combinations';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SmallTableCell as TableCell } from 'style/components';
import { Player, Result } from 'types/global';

type ScoreResult = {
    id: string;
    formId?: string;
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
    players: (Omit<Player, 'active'> & { formId: string })[];
    results: Result[];
    promotion: number;
    onAddPlayer: (index: number) => void;
    className?: string;
    allActivePlayers: QueryDocumentSnapshot<Player>[] | undefined;
};

function ScoreTable({
    players,
    promotion,
    onAddPlayer,
    results,
    className,
    allActivePlayers,
}: Props) {
    const { t } = useTranslation();

    const result = useMemo<ScoreResult[]>(() => {
        if (isEmpty(results)) {
            return map(players, (player) => ({
                id: player.id || '',
                formId: player.formId,
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

        return getAllPlayersResults(map(players, 'id'), results);
    }, [results, players]);

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
                                        findPlayerNameById(id, allActivePlayers)
                                    ) : (
                                        <RoundAddButton
                                            onAdd={() => {
                                                onAddPlayer(index);
                                            }}
                                        />
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
