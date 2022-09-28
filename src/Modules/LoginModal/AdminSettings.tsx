import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { Alert, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useAuthUser } from '@react-query-firebase/auth';
import { auth } from 'config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { get } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function AdminSettings() {
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const user = useAuthUser(['user'], auth);
    const email = user?.data?.email;

    const { t } = useTranslation();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setError('');
        setOpen(false);
    };

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, 'admin@admin.pl', password);

            setError('');
            handleClose();
        } catch (e) {
            setError(get(e, 'message', ''));
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);

            setError('');
            handleClose();
        } catch (e) {}
    };

    return (
        <>
            {email}
            {email ? (
                <IconButton color="inherit" onClick={handleSignOut}>
                    <LogoutIcon />
                </IconButton>
            ) : (
                <IconButton color="inherit" onClick={handleClickOpen}>
                    <LoginIcon />
                </IconButton>
            )}
            <div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{t('Logowanie')}</DialogTitle>
                    {error && <Alert severity="error">{error}</Alert>}
                    <DialogContent>
                        <TextField
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="dense"
                            id="name"
                            label={t('Hasło')}
                            type="password"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>{t('Anuluj')}</Button>
                        <Button onClick={handleSignIn}>{t('Zaloguj')}</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}

export default AdminSettings;
