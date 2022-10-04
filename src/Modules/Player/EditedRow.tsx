import { Box, Button, Grid, IconButton, MenuItem, Paper, Select, TextField } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { TableCell } from 'style/components';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Loading } from 'components/Loading';
import {
    usePlayerListQuery,
    useSchemaListQuery,
    useStorePlayerMutation,
    useUpdatePlayerMutation,
} from 'hooks';
import { concat, filter, find, includes, map, size } from 'lodash';
import { generatePath, useNavigate } from 'react-router-dom';
import { routes } from 'routing/routes';
import { Fn, GroupStageType, Player } from 'types/global';
import { useTranslation } from 'react-i18next';
import { TableContainer } from 'components/TableContainer';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import {
    UseFormGetValues,
    Control,
    Controller,
    FieldArrayWithId,
    useFieldArray,
    useForm,
    UseFormTrigger,
} from 'react-hook-form';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Players } from 'pages/PlayerList';
import { playerListQueryKey } from 'hooks/usePlayerListQuery';
import { useQueryClient } from 'react-query';

type Props = {
    isEdited: boolean;
    control: Control<Players, any>;
    field: FieldArrayWithId<Players, 'players', 'formId'>;
    index: number;
    onEdit: (field: FieldArrayWithId<Players, 'players', 'formId'>) => void;
    trigger: UseFormTrigger<Players>;
    getValues: UseFormGetValues<Players>;
    onCancel: (field: FieldArrayWithId<Players, 'players', 'formId'>, index: number) => void;
};

function EditedRow({
    isEdited,
    control,
    field,
    index,
    onEdit,
    trigger,
    getValues,
    onCancel,
}: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { mutate: updateMutate, isLoading: updateIsLoading } = useUpdatePlayerMutation(
        field.id || ''
    );
    const { mutate: storeMutate, isLoading: storeIsLoading } = useStorePlayerMutation();

    return (
        <TableRow hover>
            <TableCell component="th" scope="row">
                <Controller
                    defaultValue={field.firstName}
                    name={`players.${index}.firstName`}
                    control={control}
                    rules={{ required: t('To pole jest wymagane') }}
                    render={({ field: { value, onChange }, fieldState: { error } }) =>
                        isEdited ? (
                            <TextField
                                onChange={onChange}
                                value={value}
                                error={!!error}
                                helperText={error?.message || ''}
                                size="small"
                            />
                        ) : (
                            <>{value}</>
                        )
                    }
                />
            </TableCell>
            <TableCell>
                <Controller
                    defaultValue={field.lastName}
                    name={`players.${index}.lastName`}
                    control={control}
                    rules={{ required: t('To pole jest wymagane') }}
                    render={({ field: { value, onChange }, fieldState: { error } }) =>
                        isEdited ? (
                            <TextField
                                onChange={onChange}
                                value={value}
                                error={!!error}
                                helperText={error?.message || ''}
                                size="small"
                            />
                        ) : (
                            <>{value}</>
                        )
                    }
                />
            </TableCell>
            <TableCell>
                <Controller
                    defaultValue={field.active}
                    name={`players.${index}.active`}
                    control={control}
                    render={({ field: { value, onChange } }) =>
                        isEdited ? (
                            <Select onChange={onChange} value={value} size="small">
                                <MenuItem value={1}>{t('Tak')}</MenuItem>
                                <MenuItem value={0}>{t('Nie')}</MenuItem>
                            </Select>
                        ) : value ? (
                            t('Tak')
                        ) : (
                            t('Nie')
                        )
                    }
                />
            </TableCell>
            <TableCell align="center">
                <Box className="flex justify-center">
                    {!isEdited ? (
                        <>
                            <IconButton size="small" onClick={() => onEdit(field)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    navigate(
                                        generatePath(routes.PLAYER_DETAIL.path, {
                                            id: field.id,
                                        })
                                    );
                                }}
                            >
                                <VisibilityIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <Loading loading={updateIsLoading || storeIsLoading} className="m-0">
                                {(loading) => (
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        disabled={loading}
                                        onClick={async () => {
                                            await trigger([
                                                `players.${index}.lastName`,
                                                `players.${index}.firstName`,
                                            ]);

                                            const { active, firstName, lastName } = getValues(
                                                `players.${index}`
                                            );

                                            if (field.id) {
                                                updateMutate(
                                                    {
                                                        active,
                                                        firstName,
                                                        lastName,
                                                    },
                                                    {
                                                        onSuccess: () => {
                                                            onCancel(field, index);
                                                        },
                                                    }
                                                );
                                            } else {
                                                storeMutate(
                                                    {
                                                        active,
                                                        firstName,
                                                        lastName,
                                                    },
                                                    {
                                                        onSuccess: () => {
                                                            onCancel(field, index);
                                                        },
                                                    }
                                                );
                                            }
                                        }}
                                    >
                                        <SaveIcon />
                                    </IconButton>
                                )}
                            </Loading>
                            <IconButton
                                size="small"
                                onClick={() => {
                                    onCancel(field, index);
                                }}
                            >
                                <CancelIcon />
                            </IconButton>
                        </>
                    )}
                </Box>
            </TableCell>
        </TableRow>
    );
}
export default React.memo(EditedRow);
