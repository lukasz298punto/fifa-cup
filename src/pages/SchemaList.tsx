import { useTheme } from '@emotion/react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { CircularProgress, IconButton, useMediaQuery } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableContainer } from 'components/TableContainer';
import { useIsLogged, useSchemaListQuery } from 'hooks';
import { find, get, map, size } from 'lodash';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';
import { routes } from 'routing/routes';
import { TableCell } from 'style/components';
import { GroupStageType } from 'types/global';

function SchemaList() {
    const { data, isLoading } = useSchemaListQuery();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isLogged = useIsLogged();
    const theme = useTheme();
    const matches = useMediaQuery(get(theme, 'breakpoints').down('sm'));

    useEffect(() => {
        if (!isLogged) {
            navigate(generatePath(routes.HOME.path));
        }
    }, [isLogged, navigate]);

    if (isLoading) {
        return <CircularProgress size={24} />;
    }

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{t('Nazwa')}</TableCell>
                        {!matches && <TableCell align="right">{t('Ilość faz')}</TableCell>}
                        {!matches && (
                            <TableCell align="center" width={150}>
                                {t('Faza grupowa')}
                            </TableCell>
                        )}
                        <TableCell width={100} align="center">
                            {t('Akcje')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {map(data?.docs, (docSnapshot) => {
                        const { name, phases } = docSnapshot.data();

                        return (
                            <TableRow hover key={docSnapshot.id}>
                                <TableCell component="th" scope="row">
                                    {name}
                                </TableCell>
                                {!matches && <TableCell align="right">{size(phases)}</TableCell>}
                                {!matches && (
                                    <TableCell align="center">
                                        {find(phases, { isGroupStage: GroupStageType.GroupStage })
                                            ? t('Tak')
                                            : t('Nie')}
                                    </TableCell>
                                )}
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            navigate(
                                                generatePath(routes.SCHEMA_DETAIL.path, {
                                                    id: docSnapshot.id,
                                                })
                                            );
                                        }}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default SchemaList;
