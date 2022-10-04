import { styled } from '@mui/material/styles';
import { default as MuiTableCell, tableCellClasses } from '@mui/material/TableCell';

export const TableCell = styled(MuiTableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.grey[200],
        padding: 8,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 13,
        padding: 8,
    },
}));
