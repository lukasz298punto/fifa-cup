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
import { Player, Config } from 'types/global';

export const playerQueryKey = 'config';

function useConfigQuery() {
    const ref = doc(firestore, 'config', 'global') as DocumentReference<Config>;

    return useFirestoreDocument([playerQueryKey], ref);
}

export default useConfigQuery;
