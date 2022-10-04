import SaveIcon from '@mui/icons-material/Save';
import { Button } from '@mui/material';
import { firestore } from 'config/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import { useStoreTournamentMutation } from 'hooks';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routing/routes';
import { Schema } from 'types/global';

function TournamentNew() {
    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();
    const { t } = useTranslation();

    const { mutate: storeMutate, isLoading: storeIsLoading } = useStoreTournamentMutation();

    console.log(id, 'id');

    return (
        <Button
            onClick={() => {
                storeMutate(
                    {
                        name: '111',
                        status: 1,
                        endDate: '11',
                        startDate: '111',
                        schema: doc(
                            firestore,
                            'schemas',
                            '3AfG8giFl20qWX1MkYX7'
                        ) as DocumentReference<Schema>,
                    },
                    {
                        onSuccess: (res) => {
                            navigate(generatePath(routes.TOURNAMENT_DETAIL.path, { id: res.id }));
                            console.log(res.id, 'res');
                        },
                    }
                );
            }}
            startIcon={<SaveIcon />}
            color="primary"
            children={t('Zapisz')}
        />
    );
}
export default TournamentNew;
