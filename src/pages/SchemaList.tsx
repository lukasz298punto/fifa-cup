import { Grid, Paper } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Loading } from 'components/Loading';
import { useSchemaListQuery } from 'hooks';
import { find, map, size } from 'lodash';
import { generatePath, useNavigate } from 'react-router-dom';
import { routes } from 'routing/routes';
import { GroupStageType } from 'types/global';
import { useTranslation } from 'react-i18next';

function SchemaList() {
    const { data, isLoading } = useSchemaListQuery();
    const { t } = useTranslation();
    const navigate = useNavigate();

    console.log(data?.docs, 'data');

    return (
        <Loading loading={isLoading}>
            <TableContainer
                component={Paper}
                sx={{ height: 'calc(100vh - 128px)' }}
                className="h-[calc(100vh - 128px)]"
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('Nazwa')}</TableCell>
                            <TableCell align="right">{t('Ilość faz')}</TableCell>
                            <TableCell align="right">{t('Faza grupowa')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {map(data?.docs, (docSnapshot) => {
                            const { name, phases } = docSnapshot.data();

                            console.log(docSnapshot.id, 'props');

                            return (
                                <TableRow
                                    hover
                                    key={docSnapshot.id}
                                    className="hover:cursor-pointer"
                                    onClick={() => {
                                        navigate(
                                            generatePath(routes.SCHEMA_DETAIL.path, {
                                                id: docSnapshot.id,
                                            })
                                        );
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {name}
                                    </TableCell>
                                    <TableCell align="right">{size(phases)}</TableCell>
                                    <TableCell align="right">
                                        {find(phases, { isGroupStage: GroupStageType.GroupStage })
                                            ? t('Tak')
                                            : t('Nie')}
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
