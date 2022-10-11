import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Loading } from 'components/Loading';
import { TableContainer } from 'components/TableContainer';
import { useAllPlayerListQuery } from 'hooks';
import { concat, filter, includes, last, map } from 'lodash';
import { EditedRow } from 'Modules/Player';
import { useCallback, useEffect, useState } from 'react';
import { FieldArrayWithId, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TableCell } from 'style/components';
import { Player } from 'types/global';

export type Players = {
    players: Player[];
};

function Statistics() {
    const { data, isLoading } = useAllPlayerListQuery();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [editableRows, setEditableRows] = useState<string[]>([]);

    const { control, handleSubmit, reset, trigger, getValues } = useForm<Players>();
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control,
        name: 'players',
        keyName: 'formId',
    });

    useEffect(() => {
        reset({
            players: map(data?.docs, (docSnapshot) => {
                const { firstName, lastName, active } = docSnapshot.data();

                return {
                    firstName,
                    active,
                    lastName,
                    id: docSnapshot.id,
                };
            }),
        });
    }, [data, reset]);

    useEffect(() => {
        const newRow = last(fields);

        if (newRow && !newRow?.id) {
            setEditableRows((prev) => concat(prev, newRow.formId));
        }
    }, [fields]);

    const handleRowOnEdit = useCallback((field: FieldArrayWithId<Players, 'players', 'formId'>) => {
        setEditableRows((prev) => concat(prev, field.formId));
    }, []);

    const handleRowOnCancel = useCallback(
        (field: FieldArrayWithId<Players, 'players', 'formId'>, index: number) => {
            if (field.id) {
                setEditableRows((prev) => filter(prev, (val) => val !== field.formId));
            } else {
                remove(index);
            }
        },
        [remove]
    );

    return (
        <Loading loading={isLoading}>
            <TableContainer>
                <Button
                    startIcon={<AddIcon />}
                    onClick={() => {
                        append({ firstName: '', lastName: '', active: 1 });
                    }}
                >
                    {t('Dodaj zawodnika')}
                </Button>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('Imię')}</TableCell>
                            <TableCell>{t('Nazwisko')}</TableCell>
                            <TableCell width={50} align="center">
                                {t('Aktywny')}
                            </TableCell>
                            <TableCell width={100} align="center">
                                {t('Akcje')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {map(fields, (field, index) => (
                            <EditedRow
                                key={field.formId}
                                isEdited={includes(editableRows, field.formId)}
                                control={control}
                                field={field}
                                index={index}
                                trigger={trigger}
                                getValues={getValues}
                                onEdit={handleRowOnEdit as any}
                                onCancel={handleRowOnCancel as any}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Loading>
    );
}
export default Statistics;
