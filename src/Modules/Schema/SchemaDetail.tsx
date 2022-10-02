import { useTheme } from '@emotion/react';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';
import {
    CircularProgress,
    Grid,
    IconButton,
    Paper,
    TextField,
    Typography,
    useMediaQuery,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { Loading } from 'components/Loading';
import { Title } from 'components/Title';
import { useStoreSchemaMutation, useSchemaQuery } from 'hooks';
import { schemaListQueryKey } from 'hooks/useSchemaListQuery';
import { get, map, size } from 'lodash';
import SchemaPhase from 'Modules/Schema/SchemaPhase';
import React, { useEffect, useState } from 'react';
import {
    Control,
    Controller,
    SubmitErrorHandler,
    SubmitHandler,
    useFieldArray,
    useForm,
    useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { QueryClient, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routing/routes';
import { Fn, GroupStageType, Schema } from 'types/global';

function FormButton({
    mobileIcon: MobileIcon,
    isMobile,
    ...props
}: ButtonProps & { isMobile: boolean; mobileIcon: OverridableComponent<any> }) {
    if (isMobile) {
        return (
            <IconButton onClick={props.onClick} disabled={props.disabled} color={props.color}>
                <MobileIcon />
            </IconButton>
        );
    }

    return <Button {...props} />;
}

type Props = {
    control: Control<Schema, any>;
    onSubmit: Fn;
    submitLoading: boolean;
    isNew: boolean;
};

function StepName({ control, index }: { control: Control<Schema, any>; index: number }) {
    const name = useWatch({
        control,
        name: `phases.${index}.name`,
    });

    return <Typography className="text-xs">{name}</Typography>;
}

function SchemaDetail({ control, onSubmit, submitLoading, isNew }: Props) {
    const theme = useTheme();
    const { t } = useTranslation();
    const matches = useMediaQuery(get(theme, 'breakpoints').down('sm'));
    const [activeStep, setActiveStep] = useState(0);
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control,
        name: 'phases',
        keyName: 'formId',
    });

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleAddNewStep = () => {
        append({
            name: `Etap ${size(fields) + 1}`,
            isGroupStage: GroupStageType.Cup,
            typeOfWin: 1,
            groupCount: 1,
        });
        setActiveStep((prev) => prev + 1);
    };

    const handleRemoveStep = (index: number) => () => {
        remove(index);
        setActiveStep(0);
    };

    const disabled = !isNew;

    return (
        <>
            <Paper
                sx={{
                    p: 2,
                }}
            >
                <Grid container className="flex mb-2 items-center">
                    <Grid item>
                        <Title className="mr-2">
                            {isNew
                                ? t('Tworzenie nowego schematu dla Turnieju')
                                : t('Schemat Turnieju')}
                        </Title>
                    </Grid>
                    <Grid item xs={12} md={3} lg={2}>
                        <Controller
                            defaultValue=""
                            name="name"
                            control={control}
                            rules={{ required: t('To pole jest wymagane') }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    disabled={disabled}
                                    {...field}
                                    label={t('Nazwa schematu')}
                                    error={!!error}
                                    helperText={error?.message || ''}
                                    className="w-full"
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ width: '100%' }}>
                    <Stepper
                        nonLinear
                        activeStep={activeStep}
                        orientation={matches ? 'vertical' : 'horizontal'}
                    >
                        {map(fields, (field, index) => (
                            <Step key={field.formId}>
                                <StepLabel>
                                    <Box className="flex items-center">
                                        <StepName control={control} index={index} />
                                        {size(fields) > 1 && !disabled && (
                                            <DeleteOutlineIcon
                                                onClick={handleRemoveStep(index)}
                                                fontSize="small"
                                                color="error"
                                                className="cursor-pointer"
                                            />
                                        )}
                                    </Box>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </Paper>
            <Paper
                sx={{
                    p: 2,
                    mt: 2,
                }}
            >
                {map(fields, (field, index) => (
                    <SchemaPhase
                        disabled={disabled}
                        key={field.formId}
                        control={control}
                        index={index}
                        field={field}
                        visible={index === activeStep}
                    />
                ))}

                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <FormButton
                        mobileIcon={ArrowBackIcon}
                        isMobile={matches}
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                        startIcon={<ArrowBackIcon />}
                        children={t('Poprzedni')}
                        color="primary"
                    />
                    <FormButton
                        mobileIcon={ArrowForwardIcon}
                        isMobile={matches}
                        disabled={activeStep === size(fields) - 1}
                        onClick={handleNext}
                        endIcon={<ArrowForwardIcon />}
                        children={t('Następny')}
                        color="primary"
                    />
                    <Box sx={{ flex: '1 1 auto' }} />

                    {!disabled && (
                        <>
                            <FormButton
                                mobileIcon={AddIcon}
                                isMobile={matches}
                                startIcon={<AddIcon />}
                                onClick={handleAddNewStep}
                                children={t('Dodaj faze')}
                                color="primary"
                            />
                            <Loading loading={submitLoading}>
                                {(loading) => (
                                    <FormButton
                                        onClick={onSubmit}
                                        mobileIcon={SaveIcon}
                                        isMobile={matches}
                                        startIcon={<SaveIcon />}
                                        color="primary"
                                        children={t('Zapisz')}
                                        disabled={loading}
                                    />
                                )}
                            </Loading>
                        </>
                    )}
                </Box>
            </Paper>
        </>
    );
}
export default React.memo(SchemaDetail);
