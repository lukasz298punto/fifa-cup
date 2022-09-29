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
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';

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

type FormInput = {
    isGroupStage: '0' | '1';
    groupCount: number;
    ex: any;
};

const groupSymbol = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

function CupCreator() {
    const [activeStep, setActiveStep] = useState(0);
    const [steps, setSteps] = useState([{ id: 0, label: 'Faza grupowa' }]);
    const theme = useTheme();
    const matches = useMediaQuery(get(theme, 'breakpoints').down('sm'));
    const { t } = useTranslation();
    const { control, handleSubmit } = useForm<FormInput>({
        defaultValues: { isGroupStage: '1', groupCount: 1 },
    });

    const groupCount = useWatch({ control, name: 'groupCount' });
    const isGroupStage = !!Number(useWatch({ control, name: 'isGroupStage' }));

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleAddNewStep = () => {
        setSteps((prev) => concat(prev, { id: Date.now(), label: `Etap ${size(prev) + 1}` }));
    };

    const handleRemoveStep = (stepId: number) => () => {
        setSteps((prev) => filter(prev, ({ id }) => id !== stepId));
    };

    const onSubmit: SubmitHandler<FormInput> = (data) => {
        console.log(data);
    };

    const handleOnSubmit = () => {
        handleSubmit(onSubmit)();
    };

    return (
        <Paper
            sx={{
                p: 2,
            }}
        >
            <Title className="mb-2">{t('Tworzenie nowego schematu dla Turnieju')}</Title>
            <Box sx={{ width: '100%' }}>
                <Stepper
                    nonLinear
                    activeStep={activeStep}
                    orientation={matches ? 'vertical' : 'horizontal'}
                >
                    {map(steps, ({ label, id }, index) => {
                        return (
                            <Step key={id}>
                                <StepLabel>
                                    <Box className="flex items-center">
                                        <TextField
                                            className="max-w-[9rem]"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={label}
                                        />
                                        {size(steps) > 1 && (
                                            <DeleteOutlineIcon
                                                onClick={handleRemoveStep(id)}
                                                fontSize="small"
                                                color="error"
                                                className="cursor-pointer"
                                            />
                                        )}
                                    </Box>
                                </StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <Grid container spacing={2} className="mt-4">
                    <Grid item xs={12}>
                        <FormControl>
                            <FormLabel>{t('Typ fazy')}</FormLabel>
                            <Controller
                                name="isGroupStage"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup row {...field}>
                                        <FormControlLabel
                                            value={'0'}
                                            control={<Radio />}
                                            label="Faza pucharowa"
                                        />
                                        <FormControlLabel
                                            value={'1'}
                                            control={<Radio />}
                                            label="Faza grupowa"
                                        />
                                    </RadioGroup>
                                )}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <FormControl className="w-full">
                            <FormLabel>{t('Rodzaj wygranej')}</FormLabel>
                            <Controller
                                defaultValue={1}
                                name="ex"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} size="small">
                                        <MenuItem value={1}>{t('Jeden mecz')}</MenuItem>
                                        <MenuItem value={2}>{t('Dwumecz')}</MenuItem>
                                        {!isGroupStage && (
                                            <MenuItem value={3}>{t('Best 3')}</MenuItem>
                                        )}
                                        {!isGroupStage && (
                                            <MenuItem value={4}>{t('Best 5')}</MenuItem>
                                        )}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Grid>
                    {!isGroupStage && (
                        <Grid item xs={6} md={1}>
                            <FormControl className="w-full">
                                <FormLabel>{t('Ilość par')}</FormLabel>
                                <Controller
                                    defaultValue={1}
                                    name="ex"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} size="small" type="number" />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                    )}
                    {isGroupStage && (
                        <>
                            <Grid item xs={6} md={1}>
                                <FormControl className="w-full">
                                    <FormLabel>{t('Ilość grup')}</FormLabel>
                                    <Controller
                                        defaultValue={1}
                                        name="groupCount"
                                        control={control}
                                        render={({ field }) => (
                                            <Select {...field} size="small" className="w-full">
                                                {map(range(1, size(groupSymbol) + 1), (val) => (
                                                    <MenuItem value={val}>{val}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item container>
                                <Grid item xs={12} sm={8} md={4} lg={3}>
                                    <TableContainer component={Paper}>
                                        <Table size="small" className="w-full">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left">
                                                        {t('Nazwa grupy')}
                                                    </TableCell>
                                                    <TableCell align="center" width={110}>
                                                        {t('Ilość drużyn')}
                                                    </TableCell>
                                                    <TableCell align="center" width={100}>
                                                        {t('Awans')}
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {map(range(0, groupCount), (val) => (
                                                    <TableRow key={val}>
                                                        <TableCell component="th" scope="row">
                                                            {t('Grupa')} {groupSymbol[val]}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Controller
                                                                defaultValue={5}
                                                                name="ex"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        {...field}
                                                                        size="small"
                                                                        className="w-full"
                                                                    >
                                                                        {map(
                                                                            range(3, 16),
                                                                            (val) => (
                                                                                <MenuItem
                                                                                    value={val}
                                                                                >
                                                                                    {val}
                                                                                </MenuItem>
                                                                            )
                                                                        )}
                                                                    </Select>
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Controller
                                                                defaultValue={3}
                                                                name="ex"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        {...field}
                                                                        size="small"
                                                                        className="w-full"
                                                                    >
                                                                        {map(
                                                                            range(3, 16),
                                                                            (val) => (
                                                                                <MenuItem
                                                                                    value={val}
                                                                                >
                                                                                    {val}
                                                                                </MenuItem>
                                                                            )
                                                                        )}
                                                                    </Select>
                                                                )}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Grid>
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
                        disabled={activeStep === size(steps) - 1}
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
