import { Button, ButtonGroup, Divider, Paper, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { green, red } from '@mui/material/colors';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { TableContainer } from 'components/TableContainer';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TableCell } from 'style/components';

interface TabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: string;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function TournamentDetail() {
    const [value, setValue] = React.useState('Faza grupowa');

    const { t } = useTranslation();

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    console.log(value, 'value');

    return (
        <Paper>
            {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}> */}
            <Tabs value={value} onChange={handleChange} variant="scrollable">
                <Tab label="Faza grupowa" value="Faza grupowa" />
                <Tab label="1/8" value="1/8" />
                <Tab label="1/4" value="1/4" />
                <Tab label="1/2" value="1/2" />
                <Tab label="mecz o 3." value="mecz o 3." />
                <Tab label="Finał" value="Finał" />
            </Tabs>
            {/* </Box> */}
            <TabPanel value={value} index={'Faza grupowa'}>
                <ButtonGroup variant="outlined">
                    <Button variant="contained">Grupa A</Button>
                    <Button>Grupa B</Button>
                    <Button>Grupa C</Button>
                </ButtonGroup>

                <TableContainer className="my-2">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">{t('Zawodnik')}</TableCell>
                                <TableCell width={50} className="text-center">
                                    {t('Pkt')}
                                </TableCell>
                                <TableCell width={50} className="text-center">
                                    {t('M')}
                                </TableCell>
                                <TableCell width={50} className="text-center">
                                    {t('W')}
                                </TableCell>
                                <TableCell width={50} className="text-center">
                                    {t('R')}
                                </TableCell>
                                <TableCell width={50} className="text-center">
                                    {t('P')}
                                </TableCell>
                                <TableCell width={50} className="text-center">
                                    {t('Br+')}
                                </TableCell>
                                <TableCell width={50} className="text-center">
                                    {t('Br-')}
                                </TableCell>
                                <TableCell width={50} className="text-center">
                                    {t('+/-')}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={1} style={{ backgroundColor: green[100] }}>
                                <TableCell component="th" scope="row">
                                    Japonia
                                </TableCell>
                                <TableCell
                                    component="th"
                                    scope="row"
                                    className="text-center font-bold"
                                >
                                    3
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    4
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    5
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    7
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    7
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    8
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    10
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    12
                                </TableCell>
                            </TableRow>
                            <TableRow key={1} style={{ backgroundColor: red[100] }}>
                                <TableCell component="th" scope="row">
                                    Brazylia
                                </TableCell>
                                <TableCell
                                    component="th"
                                    scope="row"
                                    className="text-center font-bold"
                                >
                                    3
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    4
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    5
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    7
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    7
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    8
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    10
                                </TableCell>
                                <TableCell component="th" scope="row" className="text-center">
                                    12
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box className="flex justify-center p-4">
                    <span className="text-xsss">Japonia </span>{' '}
                    <span className="font-bold mx-4">0 : 1</span>
                    <span className="text-xsss">Brazylia</span>
                </Box>
                <Divider />
                <Box className="flex justify-center p-4">
                    <span className="text-xsss">Japonia </span>{' '}
                    <span className="font-bold mx-4">0 : 1</span>
                    <span className="text-xsss">Brazylia</span>
                </Box>
                <Divider />
                <Box className="flex justify-center p-4 items-center">
                    <span className="text-xsss">Japonia </span>
                    <TextField
                        inputProps={{ className: 'p-1 text-center' }}
                        className="mx-1 w-10"
                        size="small"
                        id="outlined-basic"
                        variant="outlined"
                        value={10}
                    />
                    <span>:</span>
                    <TextField
                        inputProps={{ className: 'p-1 text-center' }}
                        className="mx-1 w-10"
                        size="small"
                        id="outlined-basic"
                        variant="outlined"
                        value={5}
                    />
                    <span className="text-xsss">Brazylia</span>
                </Box>
            </TabPanel>
            <TabPanel value={value} index={'1/8'}>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={'1/4'}>
                Item Three
            </TabPanel>
            <TabPanel value={value} index={'1/2'}>
                Item Three
            </TabPanel>
            <TabPanel value={value} index={'mecz o 3.'}>
                Item Three
            </TabPanel>
            <TabPanel value={value} index={'Finał'}>
                Item Three
            </TabPanel>
        </Paper>
    );
}
export default TournamentDetail;
