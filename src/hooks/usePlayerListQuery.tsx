import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import {
    collection,
    CollectionReference,
    query,
    limit,
    where,
    QueryConstraint,
    Query,
} from 'firebase/firestore';
import { Player } from 'types/global';

export const playerListQueryKey = 'players';

function usePlayerListQuery(queryConstraints: QueryConstraint[] = []) {
    const ref = query(collection(firestore, 'players'), ...queryConstraints) as Query<Player>;

    return useFirestoreQuery([playerListQueryKey, queryConstraints], ref, { subscribe: true });
}
export default usePlayerListQuery;
