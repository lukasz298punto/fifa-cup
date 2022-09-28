import { useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton, Paper, TextField, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { concat, filter, get, map, size } from 'lodash';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTheme } from '@emotion/react';
import { Title } from 'components/Title';

function CupCreator() {
    const [activeStep, setActiveStep] = useState(0);
    const [steps, setSteps] = useState([{ id: 0, label: 'Faza grupowa' }]);
    const theme = useTheme();
    const matches = useMediaQuery(get(theme, 'breakpoints').down('sm'));
    const { t } = useTranslation();

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

    return (
        <Paper
            sx={{
                p: 2,
            }}
        >
            <Title className="mb-2">{t('Tworzenie nowego Turnieju')}</Title>
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
                <Typography sx={{ mt: 2, mb: 1 }}>{steps[activeStep].label}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    {matches ? (
                        <IconButton color="primary" onClick={handleBack}>
                            <ArrowBackIcon />
                        </IconButton>
                    ) : (
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                            startIcon={<ArrowBackIcon />}
                        >
                            {t('Poprzedni')}
                        </Button>
                    )}
                    {matches ? (
                        <IconButton color="primary" onClick={handleNext}>
                            <ArrowForwardIcon />
                        </IconButton>
                    ) : (
                        <Button
                            disabled={activeStep === size(steps) - 1}
                            onClick={handleNext}
                            endIcon={<ArrowForwardIcon />}
                        >
                            {t('Następny')}
                        </Button>
                    )}
                    <Box sx={{ flex: '1 1 auto' }} />

                    {matches ? (
                        <IconButton color="primary" onClick={handleAddNewStep}>
                            <AddIcon />
                        </IconButton>
                    ) : (
                        <Button startIcon={<AddIcon />} onClick={handleAddNewStep}>
                            {t('Dodaj faze')}
                        </Button>
                    )}
                    {matches ? (
                        <IconButton color="primary">
                            <SaveIcon />
                        </IconButton>
                    ) : (
                        <Button startIcon={<SaveIcon />}>{t('Zapisz')}</Button>
                    )}
                </Box>
            </Box>
        </Paper>
    );
}
export default CupCreator;
