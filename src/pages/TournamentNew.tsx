import SaveIcon from '@mui/icons-material/Save';
import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    MenuItem,
    Paper,
    Select,
    TextField,
} from '@mui/material';
import { Loading } from 'components/Loading';
import { useIsLogged, useSchemaListQuery, useStoreTournamentMutation } from 'hooks';
import { map } from 'lodash';
import { useEffect } from 'react';
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';
import { routes } from 'routing/routes';
import { Tournament } from 'types/global';

function TournamentNew() {
    const { control, handleSubmit } = useForm<Tournament>();
    const navigate = useNavigate();
    const { data, isLoading } = useSchemaListQuery();
    const { t } = useTranslation();
    const { mutate: storeMutate, isLoading: storeIsLoading } = useStoreTournamentMutation();
    const isLogged = useIsLogged();

    const onSubmit: SubmitHandler<Tournament> = ({ schemaId, name }) => {
        storeMutate(
            {
                name,
                endDate: null,
                startDate: null,
                schemaId,
            },
            {
                onSuccess: (res) => {
                    navigate(generatePath(routes.TOURNAMENT_DETAIL.path, { id: res.id }));
                },
            }
        );
    };

    const onError: SubmitErrorHandler<Tournament> = (data) => console.log(data);

    useEffect(() => {
        if (!isLogged) {
            navigate(generatePath(routes.HOME.path));
        }
    }, [isLogged, navigate]);

    return (
        <Paper className="p-4">
            <form onSubmit={handleSubmit(onSubmit, onError)}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Loading loading={isLoading}>
                            <Controller
                                defaultValue={undefined}
                                name="schemaId"
                                control={control}
                                rules={{ required: t('To pole jest wymagane') }}
                                render={({ field, fieldState: { error } }) => (
                                    <FormControl className="w-full" error={!!error}>
                                        <FormLabel>{t('Nazwa schematu')}</FormLabel>
                                        <Select
                                            {...field}
                                            size="small"
                                            className="w-full"
                                            error={!!error}
                                        >
                                            {map(data?.docs, (docSnapshot) => {
                                                const { name } = docSnapshot.data();

                                                return (
                                                    <MenuItem
                                                        value={docSnapshot.id}
                                                        key={docSnapshot.id}
                                                    >
                                                        {name}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                        {error && <FormHelperText>{error?.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                        </Loading>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: t('To pole jest wymagane') }}
                            render={({ field, fieldState: { error } }) => (
                                <FormControl className="w-full" error={!!error}>
                                    <FormLabel>{t('Nazwa turnieju')}</FormLabel>
                                    <TextField
                                        {...field}
                                        size="small"
                                        error={!!error}
                                        helperText={error?.message || ''}
                                    />
                                </FormControl>
                            )}
                        />
                    </Grid>
                </Grid>
                <Loading loading={storeIsLoading}>
                    <Button
                        className="mt-1"
                        type="submit"
                        startIcon={<SaveIcon />}
                        color="primary"
                        children={t('Utwórz')}
                    />
                </Loading>
            </form>
        </Paper>
    );
}
export default TournamentNew;
