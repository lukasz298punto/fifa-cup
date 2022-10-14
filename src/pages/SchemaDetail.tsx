import { CircularProgress, Paper } from '@mui/material';
import { Loading } from 'components/Loading';
import { useStoreSchemaMutation, useSchemaQuery } from 'hooks';
import { schemaListQueryKey } from 'hooks/useSchemaListQuery';
import { SchemaDetail as SchemaView } from 'Modules/Schema';
import { useCallback, useEffect } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routing/routes';
import { GroupStageType, Schema } from 'types/global';

function SchemaDetail() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const isNew = id === '0';
    const { data: schemaData, isLoading: schemaIsLoading } = useSchemaQuery(id as string, {
        enabled: !!id && !isNew,
    });
    const navigate = useNavigate();
    const { mutate, isLoading } = useStoreSchemaMutation();
    const { control, handleSubmit, reset } = useForm<Schema>();

    console.log(schemaData?.data(), 'schemaData');
    console.log(control, 'control');

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

    const onSubmit = useCallback<SubmitHandler<Schema>>(
        async (data) => {
            console.log(data, 'data');
            await mutate(data);

            queryClient.invalidateQueries(schemaListQueryKey);
            navigate(routes.SCHEMA_LIST.path);
        },
        [mutate, queryClient, navigate]
    );

    const onError = useCallback<SubmitErrorHandler<Schema>>((data) => {
        console.log(data);
    }, []);

    const handleOnSubmit = useCallback(() => {
        handleSubmit(onSubmit, onError)();
    }, [handleSubmit, onSubmit, onError]);

    if (schemaIsLoading) {
        return <CircularProgress size={24} />;
    }

    return (
        <SchemaView
            control={control}
            onSubmit={handleOnSubmit}
            submitLoading={isLoading}
            isNew={isNew}
        />
    );
}
export default SchemaDetail;
