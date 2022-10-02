import { usePlayerQuery } from 'hooks';
import { useParams } from 'react-router-dom';

function PlayerDetail() {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = usePlayerQuery(id as string, {
        enabled: !!id,
    });

    console.log(data, 'data');

    return <>abc</>;
}
export default PlayerDetail;
