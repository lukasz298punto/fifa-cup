import { IconButton, IconButtonTypeMap } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

type Props = {
    onAdd: () => void;
} & IconButtonTypeMap['props'];

function RoundAddButton({ onAdd, ...props }: Props) {
    return (
        <IconButton className="p-0" size="small" color="primary" onClick={onAdd} {...props}>
            <AddCircleIcon />
        </IconButton>
    );
}
export default RoundAddButton;
