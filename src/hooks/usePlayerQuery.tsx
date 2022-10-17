import { useFirestoreDocument, useFirestoreQuery } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import {
    collection,
    CollectionReference,
    query,
    limit,
    where,
    doc,
    DocumentReference,
} from 'firebase/firestore';
import { UseQueryOptions } from 'react-query';
import { Player } from 'types/global';

export const playerQueryKey = 'player';

function usePlayerQuery(id: string) {
    const ref = (id ? doc(firestore, 'players', id) : null) as DocumentReference<Player>;
    const query = useFirestoreDocument<Player>([playerQueryKey, id], ref);

    return query;
}

export default usePlayerQuery;
