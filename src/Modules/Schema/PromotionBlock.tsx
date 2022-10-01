import { FormControl, FormHelperText, MenuItem, Select } from '@mui/material';
import { map, range } from 'lodash';
import { SchemaFormInput } from 'pages/SchemaDetail';
import React, { useEffect } from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Fn } from 'types/global';

type Props = {
    control: Control<SchemaFormInput, any>;
    defaultValue: number | undefined;
    groupIndex: number;
    disabled: boolean;
    phaseIndex: number;
    onClear: (playerCount: number) => void;
};

function PromotionBlock({
    phaseIndex,
    defaultValue,
    groupIndex,
    control,
    onClear,
    disabled,
}: Props) {
    const playerCount = useWatch({
        control,
        name: `phases.${phaseIndex}.groups.${groupIndex}.playerCount`,
    });
    const promotion = useWatch({
        control,
        name: `phases.${phaseIndex}.groups.${groupIndex}.promotion`,
    });
    const { t } = useTranslation();

    useEffect(() => {
        if (promotion && playerCount < promotion) {
            onClear(playerCount);
        }
    }, [playerCount, onClear, promotion]);

    return (
        <Controller
            defaultValue={defaultValue}
            name={`phases.${phaseIndex}.groups.${groupIndex}.promotion`}
            control={control}
            rules={{ required: t('To pole jest wymagane') }}
            render={({ field, fieldState: { error } }) => (
                <FormControl className="w-full" error={!!error}>
                    <Select
                        {...field}
                        size="small"
                        className="w-full"
                        error={!!error}
                        disabled={disabled}
                    >
                        {map(range(1, playerCount + 1), (val) => (
                            <MenuItem value={val} key={val}>
                                {val}
                            </MenuItem>
                        ))}
                    </Select>
                    {error && <FormHelperText>{error?.message}</FormHelperText>}
                </FormControl>
            )}
        />
    );
}

export default React.memo(PromotionBlock);
