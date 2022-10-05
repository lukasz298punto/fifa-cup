import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import { Button, ButtonGroup, IconButton, Paper, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { blue, green, red } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { TableContainer } from 'components/TableContainer';
import { combinations, map, range, size } from 'lodash';
import 'lodash.combinations';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TableCell } from 'style/components';
import { Player } from 'types/global';

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

const isTwoMatch = false;

type Tournament = {
    players: Omit<Player, 'active'>[];
    results: [Player, Player][];
};

const schema = {
    playerCount: 3,
    promotion: 1,
};

function TournamentDetail() {
    const [value, setValue] = useState('Faza grupowa');
    const teams = ['Japonia', 'Anglia', 'Argentyna'];
    let pairs = combinations(teams, 2);

    const [open, setOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState<number | null>(null);
    const [selectedValue, setSelectedValue] = useState([]);

    const handleClickOpen = (index: number) => () => {
        setModalIndex(index);
        setOpen(true);
    };

    const handleClose = () => {
        setModalIndex(null);
        setOpen(false);
    };

    const { control, handleSubmit, reset, register } = useForm<Tournament>();

    const { fields, append, prepend, remove, swap, move, insert, update } = useFieldArray({
        control,
        name: 'players',
        keyName: 'formId',
    });

    useEffect(() => {
        reset({
            players: map(range(0, schema.playerCount), () => ({
                id: '',
                firstName: '',
                lastName: '',
            })),
            results: [],
        });
    }, [reset]);

    const results = useWatch({
        control,
        name: 'results',
    });

    console.log(results, 'results');

    const { t } = useTranslation();

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    console.log(value, 'value');

    const emails = ['username@gmail.com', 'user02@gmail.com', 'user03@gmail.com'];

    console.log(combinations(fields, 2), 'combina');

    return (
        <>
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>Set backup account</DialogTitle>
                <List sx={{ pt: 0 }}>
                    {emails.map((email) => (
                        <ListItem
                            button
                            onClick={() => {
                                update(modalIndex as number, {
                                    id: email,
                                    firstName: email,
                                    lastName: 'Boczon',
                                });
                                handleClose();
                            }}
                            key={email}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={email} />
                        </ListItem>
                    ))}
                </List>
            </Dialog>
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
                                {map(fields, (field, index) => (
                                    <TableRow
                                        key={field.formId}
                                        style={{
                                            backgroundColor:
                                                schema.promotion > index ? green[100] : red[100],
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {field.id ? (
                                                `${field.firstName} ${field.lastName}`
                                            ) : (
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={handleClickOpen(index)}
                                                >
                                                    <AddCircleIcon />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            className="text-center font-bold"
                                        >
                                            0
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            className="text-center"
                                        >
                                            0
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            className="text-center"
                                        >
                                            0
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            className="text-center"
                                        >
                                            0
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            className="text-center"
                                        >
                                            {results?.[0][0].lastName}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            className="text-center"
                                        >
                                            0
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            className="text-center"
                                        >
                                            0
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            className="text-center"
                                        >
                                            0
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box className="flex justify-center">
                        <table>
                            <tbody>
                                {map(combinations(fields, 2), ([teamA, teamB], index) => (
                                    <tr key={index}>
                                        <td className="text-right py-3 border-b-2">
                                            {teamA.firstName && (
                                                <Controller
                                                    defaultValue={teamA.firstName}
                                                    name={`results.${index}.0.firstName`}
                                                    control={control}
                                                    render={({
                                                        field: { value },
                                                        fieldState: { error },
                                                    }) => <>{value}</>}
                                                />
                                            )}
                                            {/* <span className="text-xsss">{teamA.firstName} </span> */}
                                        </td>
                                        <td className="py-3 border-b-2">
                                            <span>
                                                <Controller
                                                    defaultValue={teamA.lastName}
                                                    name={`results.${index}.0.lastName`}
                                                    control={control}
                                                    rules={{ required: t('To pole jest wymagane') }}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <TextField
                                                            inputProps={{
                                                                className: 'p-1 text-center',
                                                            }}
                                                            {...field}
                                                            className="mx-1 w-10"
                                                            size="small"
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                                :
                                                <Controller
                                                    defaultValue={teamB.lastName}
                                                    name={`results.${index}.1.lastName`}
                                                    control={control}
                                                    rules={{ required: t('To pole jest wymagane') }}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <TextField
                                                            inputProps={{
                                                                className: 'p-1 text-center',
                                                            }}
                                                            {...field}
                                                            className="mx-1 w-10"
                                                            size="small"
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </span>
                                        </td>
                                        <td className="text-left border-b-2 py-3 ">
                                            {teamB.firstName && (
                                                <Controller
                                                    defaultValue={teamB.firstName}
                                                    name={`results.${index}.1.firstName`}
                                                    control={control}
                                                    render={({
                                                        field: { value },
                                                        fieldState: { error },
                                                    }) => <>{value}</>}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
        </>
    );
}
export default TournamentDetail;
