import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button, { ButtonProps } from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
    Avatar,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
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
    useMediaQuery,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { concat, filter, get, map, range, size } from 'lodash';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTheme } from '@emotion/react';
import { Title } from 'components/Title';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import {
    Controller,
    SubmitErrorHandler,
    SubmitHandler,
    useFieldArray,
    useForm,
    useWatch,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SchemaPhase from 'Modules/CupCreator/SchemaPhase';

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

export type SchemaFormInput = {
    name: string;
    phases: {
        name: string;
        isGroupStage: '0' | '1';
        typeOfWin: number;
        pairCount?: number;
        groupCount?: number;
        groups?: { promotion: number; playerCount: number }[];
    }[];
    ex: any;
};

// const schema = yup
//     .object({
//         name: yup.string().required(),
//         phases: {
//             pairCount: yup.string().required(),
//         },
//     })

//     .required();

function CupCreator() {
    const [activeStep, setActiveStep] = useState(0);
    const theme = useTheme();
    const matches = useMediaQuery(get(theme, 'breakpoints').down('sm'));
    const { t } = useTranslation();
    const { control, handleSubmit } = useForm<SchemaFormInput>({
        defaultValues: {
            phases: [{ isGroupStage: '0', typeOfWin: 1, name: 'Faza grupowa' }],
        },
    });

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
        append({ name: `Etap ${size(fields) + 1}`, isGroupStage: '0', typeOfWin: 1 });
    };

    const handleRemoveStep = (index: number) => () => {
        remove(index);
    };

    const onSubmit: SubmitHandler<SchemaFormInput> = (data) => {
        console.log(data);
    };

    const onError: SubmitErrorHandler<SchemaFormInput> = (data) => {
        console.log(data);
    };

    const handleOnSubmit = () => {
        handleSubmit(onSubmit, onError)();
    };

    return (
        <Paper
            sx={{
                p: 2,
            }}
        >
            <Box className="flex mb-1 items-center">
                <Title className="mr-2">{t('Tworzenie nowego schematu dla Turnieju')}</Title>
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: t('To pole jest wymagane') }}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            label={t('Nazwa schematu')}
                            error={!!error}
                            helperText={error?.message || ''}
                            {...field}
                            size="small"
                        />
                    )}
                />
            </Box>
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
                                    <TextField
                                        className="max-w-[9rem]"
                                        variant="outlined"
                                        size="small"
                                        defaultValue={field.name}
                                    />
                                    {size(fields) > 1 && (
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

                {map(fields, (field, index) => (
                    <SchemaPhase
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

                    <FormButton
                        mobileIcon={AddIcon}
                        isMobile={matches}
                        startIcon={<AddIcon />}
                        onClick={handleAddNewStep}
                        children={t('Dodaj faze')}
                        color="primary"
                    />
                    <FormButton
                        onClick={handleOnSubmit}
                        mobileIcon={SaveIcon}
                        isMobile={matches}
                        startIcon={<SaveIcon />}
                        color="primary"
                        children={t('Zapisz')}
                    />
                </Box>
            </Box>
        </Paper>
    );
}
export default CupCreator;
