import { Alert } from '@mui/material';
import Box from '@mui/material/Box';
import { PlayerPicker } from 'components/PlayerPicker';
import { ScoreRow, ScoreTable } from 'components/ScoreTable';
import { combinations, compact, concat, filter, isEmpty, map, range } from 'lodash';
import 'lodash.combinations';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Control, useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useUpdateEffect } from 'react-use';
import { Player, TournamentSchema, TypeOfWin } from 'types/global';

type Props = {
    control: Control<TournamentSchema, any>;
    typeOfWin: TypeOfWin;
    promotion: any;
    index: number;
    phaseIndex: number;
    playerCount: number;
};

function Group({ control, typeOfWin, promotion, index, phaseIndex, playerCount }: Props) {
    const { t } = useTranslation();

    const {
        fields: players,
        replace,
        update,
    } = useFieldArray({
        control,
        name: `phases.${phaseIndex}.groups.${index}.players`,
        keyName: 'formId',
    });
    const { fields: results, replace: resultsReplace } = useFieldArray({
        control,
        name: `phases.${phaseIndex}.groups.${index}.results`,
        keyName: 'formId',
    });

    const [modalIndex, setModalIndex] = useState<number | null>(null);
    const handleClickOpen = useCallback((index: number) => {
        setModalIndex(index);
        setOpen(true);
    }, []);

    const [open, setOpen] = useState(false);

    const handleClose = useCallback(() => {
        setModalIndex(null);
        setOpen(false);
    }, []);

    const disabledPlayers = useMemo(() => {
        return compact(map(players, 'id'));
    }, [players]);

    const resultsValues = useWatch({
        control,
        name: `phases.${phaseIndex}.groups.${index}.results`,
    });

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

    useUpdateEffect(() => {
        if (isEmpty(filter(players, (field) => !field.id))) {
            const baseCombinations = map(combinations(players, 2), ([teamA, teamB]) => ({
                playerA: { id: teamA.id || '', score: '' },
                playerB: { id: teamB.id || '', score: '' },
            }));

            resultsReplace(
                typeOfWin === TypeOfWin.TwoMatch
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
    }, [players]);

    // useEffect(() => {
    //     replace(
    //         map(range(0, playerCount), () => ({
    //             id: '',
    //             firstName: '',
    //             lastName: '',
    //         }))
    //     );
    // }, [playerCount, replace]);

    return (
        <>
            <PlayerPicker
                onClose={handleClose}
                open={open}
                onPick={handlePick}
                disabledPlayers={disabledPlayers}
            />
            <ScoreTable
                className="my-2"
                players={players}
                onAddPlayer={handleClickOpen}
                promotion={promotion}
                results={resultsValues}
            />
            <Box>
                {isEmpty(results) && (
                    <Alert severity="info" variant="standard">
                        {t('Wprowadź wszystkich graczy aby wygenerować terminarz')}
                    </Alert>
                )}
                {map(
                    results,
                    (result, i) =>
                        result.playerA.id &&
                        result.playerB.id && (
                            <ScoreRow
                                key={result.formId}
                                control={control}
                                result={result}
                                formName={`phases.${phaseIndex}.groups.${index}.results.${i}`}
                            />
                        )
                )}
            </Box>
        </>
    );
}
export default React.memo(Group);
