import { ScoreRow } from 'components/ScoreTable';
import { compact, flatMap, map, range } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Control, useFieldArray, useWatch } from 'react-hook-form';
import { Result, Schema, TournamentSchema } from 'types/global';

type Props = {
    schema: Schema;
    index: number;
    control: Control<TournamentSchema, any>;
};

function CupPhase({ schema, index, control }: Props) {
    const {
        fields: results,
        append,
        replace,
    } = useFieldArray({
        control,
        name: `phases.${index}.results`,
        keyName: 'formId',
    });

    const phase = schema.phases[index];

    const resultsValues = useWatch({
        control,
        name: `phases.${index}.results`,
    });

    // useEffect(() => {
    //     console.log('replace-cup', phase.pairCount);
    //     replace(
    //         map(range(0, Number(phase.pairCount) || 0), () => ({
    //             playerA: { id: '', score: '' },
    //             playerB: { id: '', score: '' },
    //         }))
    //     );
    // }, [phase.pairCount, replace]);

    const handleOnAdd = useCallback(
        (result: Result) => {
            append(result);
        },
        [append]
    );

    const disabledPlayers = useMemo(() => {
        return compact([
            ...flatMap(resultsValues, 'playerA.id'),
            ...flatMap(resultsValues, 'playerB.id'),
        ]);
    }, [resultsValues]);

    console.log(results, 'results---222');

    return (
        <>
            {map(results, (result, i) => (
                <ScoreRow
                    formName={`phases.${index}.results.${i}`}
                    disabledPlayers={disabledPlayers}
                    typeOfWin={phase.typeOfWin}
                    control={control}
                    result={result}
                    key={result.formId}
                    onAdd={handleOnAdd}
                />
            ))}
        </>
    );
}
export default React.memo(CupPhase);
