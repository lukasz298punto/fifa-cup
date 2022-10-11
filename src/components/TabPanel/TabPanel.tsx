import { Box } from '@mui/system';
import clsx from 'clsx';

type TabPanelProps = {
    children?: React.ReactNode;
    index: string;
    value: string;
    className?: string;
};

function TabPanel({ children, value, index, className }: TabPanelProps) {
    return (
        <div className={clsx(value !== index && 'hidden')}>
            <Box className={className}>{children}</Box>
        </div>
    );
}

export default TabPanel;
