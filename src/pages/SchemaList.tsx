import { Grid, IconButton, Paper } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Loading } from 'components/Loading';
import { useSchemaListQuery } from 'hooks';
import { find, map, size } from 'lodash';
import { generatePath, useNavigate } from 'react-router-dom';
import { routes } from 'routing/routes';
import { GroupStageType } from 'types/global';
import { useTranslation } from 'react-i18next';
import { TableContainer } from 'components/TableContainer';
import VisibilityIcon from '@mui/icons-material/Visibility';

function SchemaList() {
    const { data, isLoading } = useSchemaListQuery();
    const { t } = useTranslation();
    const navigate = useNavigate();

    console.log(data?.docs, 'data');

    return (
        <Loading loading={isLoading}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('Nazwa')}</TableCell>
                            <TableCell align="right">{t('Ilość faz')}</TableCell>
                            <TableCell align="center" width={150}>
                                {t('Faza grupowa')}
                            </TableCell>
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
                                    <TableCell align="right">{size(phases)}</TableCell>
                                    <TableCell align="center">
                                        {find(phases, { isGroupStage: GroupStageType.GroupStage })
                                            ? t('Tak')
                                            : t('Nie')}
                                    </TableCell>
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
        </Loading>
    );
}
export default SchemaList;
