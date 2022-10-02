import { Paper } from '@mui/material';
import { default as Container, TableContainerProps } from '@mui/material/TableContainer';

function TableContainer(props: TableContainerProps) {
    return (
        <Container
            {...props}
            component={Paper}
            // sx={{ height: 'calc(100vh - 128px)' }}
            // className="h-[calc(100vh - 128px)]"
        />
    );
}
export default TableContainer;
