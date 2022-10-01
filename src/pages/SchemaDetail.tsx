import { Paper } from '@mui/material';
import { Loading } from 'components/Loading';
import { useSchemaMutation, useSchemaQuery } from 'hooks';
import { schemaListQueryKey } from 'hooks/useSchemaListQuery';
import { SchemaDetail as SchemaView } from 'Modules/Schema';
import { useCallback, useEffect } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routing/routes';
import { GroupStageType } from 'types/global';

export type SchemaFormInput = {
    name: string;
    phases: {
        name: string;
        isGroupStage: GroupStageType;
        typeOfWin: number;
        pairCount?: string;
        groupCount?: number;
        groups?: { promotion?: number; playerCount: number }[];
    }[];
};

function SchemaDetail() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const isNew = id === '0';
    const { data: schemaData, isLoading: schemaIsLoading } = useSchemaQuery(id as string, {
        enabled: !!id && !isNew,
    });
    const navigate = useNavigate();
    const { mutate, isLoading } = useSchemaMutation();
    const { control, handleSubmit, reset } = useForm<SchemaFormInput>();

    useEffect(() => {
        reset(
            isNew
                ? {
                      name: '',
                      phases: [
                          {
                              isGroupStage: GroupStageType.GroupStage,
                              typeOfWin: 1,
                              name: 'Faza grupowa',
                              groupCount: 1,
                          },
                      ],
                  }
                : schemaData?.data()
        );
    }, [schemaData, reset, isNew]);

    const onSubmit = useCallback<SubmitHandler<SchemaFormInput>>(
        async (data) => {
            await mutate(data);

            queryClient.invalidateQueries(schemaListQueryKey);
            navigate(routes.SCHEMA_LIST.path);
        },
        [mutate, queryClient, navigate]
    );

    const onError = useCallback<SubmitErrorHandler<SchemaFormInput>>((data) => {
        console.log(data);
    }, []);

    const handleOnSubmit = useCallback(() => {
        handleSubmit(onSubmit, onError)();
    }, [handleSubmit, onSubmit, onError]);

    return (
        <Loading loading={schemaIsLoading}>
            <Paper
                sx={{
                    p: 2,
                }}
            >
                <SchemaView
                    control={control}
                    onSubmit={handleOnSubmit}
                    submitLoading={isLoading}
                    isNew={isNew}
                />
            </Paper>
        </Loading>
    );
}
export default SchemaDetail;
