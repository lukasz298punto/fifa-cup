import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { collection, CollectionReference, limit, orderBy, query, where } from 'firebase/firestore';
import { Schema, Tournament, TournamentSchema } from 'types/global';

export const schemaListQueryKey = 'tournaments';

function useTournamentListQuery(ref: CollectionReference<TournamentSchema>, key: string = 'all') {
    // const ref = collection(firestore, 'tournaments') as CollectionReference<Tournament>;
    // const ref = query(
    //     collection(firestore, 'tournaments'),
    //     limit(10),
    //     orderBy('endDate', 'asc')
    // ) as CollectionReference<Tournament>;

    return useFirestoreQuery([schemaListQueryKey, key], ref, { subscribe: true });
}
export default useTournamentListQuery;
