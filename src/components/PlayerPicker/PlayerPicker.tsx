import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import { Button, ButtonGroup, Grid, IconButton, Paper, TextField } from '@mui/material';
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
import { Loading } from 'components/Loading';
import { TableContainer } from 'components/TableContainer';
import { where } from 'firebase/firestore';
import { usePlayerListQuery } from 'hooks';
import { combinations, includes, map, range, size } from 'lodash';
import 'lodash.combinations';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TableCell } from 'style/components';
import { Fn, Player } from 'types/global';

type Props = {
    onClose: Fn;
    onPick: (player: Player) => void;
    disabledPlayers?: string[];
    open: boolean;
};

function PlayerPicker({ onClose, onPick, disabledPlayers, open }: Props) {
    const { data, isLoading } = usePlayerListQuery([where('active', '==', 1)]);
    const { t } = useTranslation();

    return (
        <Dialog onClose={onClose} open={open}>
            <Loading loading={isLoading}>
                <DialogTitle>{t(`Wybierz zawodnika`)}</DialogTitle>
                <List sx={{ pt: 0 }}>
                    {map(data?.docs, (docSnapshot) => {
                        const player = docSnapshot.data();

                        return (
                            <ListItem
                                disabled={includes(disabledPlayers, docSnapshot.id)}
                                button
                                onClick={() => onPick({ ...player, id: docSnapshot.id })}
                                key={docSnapshot.id}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={player.firstName + ' ' + player.lastName} />
                            </ListItem>
                        );
                    })}
                </List>
            </Loading>
        </Dialog>
    );
}
export default React.memo(PlayerPicker);
