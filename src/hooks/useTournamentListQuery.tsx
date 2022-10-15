import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { collection, CollectionReference, limit, orderBy, query, where } from 'firebase/firestore';
import { Schema, Tournament, TournamentSchema } from 'types/global';

export const schemaListQueryKey = 'tournaments';

function useTournamentListQuery(ref: CollectionReference<TournamentSchema>, key: string = 'all') {
    return useFirestoreQuery([schemaListQueryKey, key], ref, { subscribe: true });
}
export default useTournamentListQuery;
