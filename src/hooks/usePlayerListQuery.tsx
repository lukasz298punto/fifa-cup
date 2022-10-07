import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { collection, CollectionReference, query, Query, where } from 'firebase/firestore';
import { Player } from 'types/global';

export const playerListQueryKey = 'players';

function useAllPlayerListQuery(subscribe = false) {
    const ref = collection(firestore, 'players') as CollectionReference<Player>;

    return useFirestoreQuery([playerListQueryKey, 'all'], ref, { subscribe });
}

export function useActivePlayerListQuery() {
    const ref = query(collection(firestore, 'players'), where('active', '==', 1)) as Query<Player>;

    return useFirestoreQuery(
        [playerListQueryKey, 'active'],
        ref,
        {},
        { cacheTime: 0, staleTime: 0 }
    );
}

export default useAllPlayerListQuery;
