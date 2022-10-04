import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { collection, CollectionReference } from 'firebase/firestore';
import { Schema, Tournament } from 'types/global';

export const schemaListQueryKey = 'schemas';

function useTournamentListQuery() {
    const ref = collection(firestore, 'tournaments') as CollectionReference<Tournament>;
    const query = useFirestoreQuery([schemaListQueryKey], ref);

    return query;
}
export default useTournamentListQuery;
