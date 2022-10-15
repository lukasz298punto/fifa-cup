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
    const ref = doc(firestore, 'players', id) as DocumentReference<Player>;

    return useFirestoreQuery(
        [playerQueryKey],
        query(collection(firestore, 'wins'), where('player', '==', ref))
    );
}

export default usePlayerQuery;
