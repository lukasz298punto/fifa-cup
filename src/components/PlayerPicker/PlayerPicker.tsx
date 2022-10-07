import PersonIcon from '@mui/icons-material/Person';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { Loading } from 'components/Loading';
import { useActivePlayerListQuery } from 'hooks';
import { includes, map } from 'lodash';
import 'lodash.combinations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Fn, Player } from 'types/global';

type Props = {
    onClose: Fn;
    onPick: (player: Player) => void;
    disabledPlayers?: string[];
    open: boolean;
};

function PlayerPicker({ onClose, onPick, disabledPlayers, open }: Props) {
    const { data, isLoading } = useActivePlayerListQuery();
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
