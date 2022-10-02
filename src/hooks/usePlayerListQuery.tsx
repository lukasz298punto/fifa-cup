import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { collection, CollectionReference, query, limit, where } from 'firebase/firestore';
import { Player } from 'types/global';

export const playerListQueryKey = 'players';

function usePlayerListQuery() {
    const ref = collection(firestore, 'players') as CollectionReference<Player>;

    return useFirestoreQuery([playerListQueryKey], ref, { subscribe: true });
}
export default usePlayerListQuery;
