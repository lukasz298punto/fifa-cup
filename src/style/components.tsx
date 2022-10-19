import { styled } from '@mui/material/styles';
import { default as MuiTableCell, tableCellClasses } from '@mui/material/TableCell';

export const TableCell = styled(MuiTableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.grey[200],
        padding: 8,
        fontSize: 12,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        padding: 8,
    },
}));

export const SmallTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        padding: 6,
    },
    [`&.${tableCellClasses.body}`]: {
        padding: 6,
    },
}));
