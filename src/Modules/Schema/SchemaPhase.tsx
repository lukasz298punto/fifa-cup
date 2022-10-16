import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import clsx from 'clsx';
import { groupSymbol } from 'constants/global';
import { parseInputNumber } from 'helpers/global';
import { isEmpty, map, range, size } from 'lodash';
import React, { useEffect } from 'react';
import { Control, Controller, FieldArrayWithId, useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Schema, TypeOfWin } from 'types/global';
import PromotionBlock from './PromotionBlock';

type Props = {
    control: Control<Schema, any>;
    index: number;
    visible: boolean;
    disabled: boolean;
    field: FieldArrayWithId<Schema, 'phases', 'formId'>;
};

function SchemaPhase({ control, index, field, visible, disabled }: Props) {
    const { t } = useTranslation();

    const { id } = useParams<{ id: string }>();
    const isNew = id === '0';
    const groupCount = useWatch({ control, name: `phases.${index}.groupCount` });
    const isGroupStage = !!Number(useWatch({ control, name: `phases.${index}.isGroupStage` }));

    const { fields, append, prepend, remove, swap, move, insert, replace, update } = useFieldArray({
        control,
        name: `phases.${index}.groups`,
        keyName: 'formId',
    });

    useEffect(() => {
        if (groupCount && isNew) {
            replace(map(range(0, groupCount), () => ({ playerCount: 3, promotion: 1 })));
        }
    }, [groupCount, replace, isNew]);

    return (
        <Grid container spacing={2} className={clsx(!visible && 'hidden')}>
            <Grid item xs={12}>
                <FormControl>
                    <FormLabel>{t('Nazwa fazy')}</FormLabel>
                    <Controller
                        defaultValue={field.name}
                        name={`phases.${index}.name`}
                        control={control}
                        rules={{ required: t('To pole jest wymagane') }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                disabled={disabled}
                                variant="outlined"
                                {...field}
                                error={!!error}
                                helperText={error?.message || ''}
                                size="small"
                            />
                        )}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControl>
                    <FormLabel>{t('Typ fazy')}</FormLabel>
                    <Controller
                        defaultValue={field.isGroupStage}
                        name={`phases.${index}.isGroupStage`}
                        control={control}
                        render={({ field }) => (
                            <RadioGroup row {...field}>
                                <FormControlLabel
                                    disabled={disabled}
                                    value={'0'}
                                    control={<Radio />}
                                    label={t('Faza pucharowa')}
                                />
                                <FormControlLabel
                                    disabled={disabled}
                                    value={'1'}
                                    control={<Radio />}
                                    label={t('Faza grupowa')}
                                />
                            </RadioGroup>
                        )}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
                <FormControl className="w-full">
                    <InputLabel>{t('Rodzaj wygranej')}</InputLabel>
                    <Controller
                        defaultValue={field.typeOfWin}
                        name={`phases.${index}.typeOfWin`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                size="small"
                                label={t('Rodzaj wygranej')}
                                disabled={disabled}
                            >
                                <MenuItem value={TypeOfWin.OneMatch}>{t('Jeden mecz')}</MenuItem>
                                <MenuItem value={TypeOfWin.TwoMatch}>{t('Dwumecz')}</MenuItem>
                            </Select>
                        )}
                    />
                </FormControl>
            </Grid>
            {!isGroupStage && (
                <Grid item xs={6} md={2} lg={1}>
                    <Controller
                        defaultValue={field.pairCount || ''}
                        rules={{
                            required: t('To pole jest wymagane'),
                            min: { value: 1, message: t('Więcej od 0') },
                        }}
                        name={`phases.${index}.pairCount`}
                        control={control}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <TextField
                                disabled={disabled}
                                label={t('Ilość par')}
                                value={value}
                                onChange={(e) => {
                                    onChange(parseInputNumber(e.target.value));
                                }}
                                size="small"
                                type="number"
                                error={!!error}
                                helperText={error?.message || ''}
                            />
                        )}
                    />
                </Grid>
            )}
            {isGroupStage && (
                <>
                    <Grid item xs={6} md={2} lg={1}>
                        <Controller
                            defaultValue={field.groupCount}
                            name={`phases.${index}.groupCount`}
                            rules={{ required: t('To pole jest wymagane') }}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <FormControl className="w-full" error={!!error}>
                                    <InputLabel>{t('Ilość grup')}</InputLabel>
                                    <Select
                                        disabled={disabled}
                                        label={t('Ilość grup')}
                                        {...field}
                                        size="small"
                                        className="w-full"
                                        error={!!error}
                                    >
                                        {map(range(1, size(groupSymbol) + 1), (val) => (
                                            <MenuItem value={val} key={val}>
                                                {val}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {!!error && <FormHelperText>{error?.message}</FormHelperText>}
                                </FormControl>
                            )}
                        />
                    </Grid>
                    {!isEmpty(fields) && (
                        <Grid item container>
                            <Grid item xs={12} sm={8} md={4} lg={3}>
                                <TableContainer component={Paper}>
                                    <Table size="small" className="w-full">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">{t('Nazwa')}</TableCell>
                                                <TableCell align="center" width={110}>
                                                    {t('Ilość drużyn')}
                                                </TableCell>
                                                <TableCell align="center" width={90}>
                                                    {t('Awans')}
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {map(fields, (field, i) => (
                                                <TableRow key={field.formId}>
                                                    <TableCell component="th" scope="row">
                                                        {t('Grupa')} {groupSymbol[i]}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Controller
                                                            defaultValue={field.playerCount}
                                                            name={`phases.${index}.groups.${i}.playerCount`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    disabled={disabled}
                                                                    {...field}
                                                                    size="small"
                                                                    className="w-full"
                                                                >
                                                                    {map(range(3, 16), (val) => (
                                                                        <MenuItem
                                                                            value={val}
                                                                            key={val}
                                                                        >
                                                                            {val}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <PromotionBlock
                                                            onClear={(playerCount) =>
                                                                update(i, {
                                                                    playerCount,
                                                                })
                                                            }
                                                            disabled={disabled}
                                                            groupIndex={i}
                                                            phaseIndex={index}
                                                            control={control}
                                                            defaultValue={field.promotion}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    )}
                </>
            )}
        </Grid>
    );
}
export default React.memo(SchemaPhase);
