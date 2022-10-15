import { useAuthUser } from '@react-query-firebase/auth';
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
import { auth } from 'config/firebase';

export const playerQueryKey = 'config';

function useIsLogged() {
    const user = useAuthUser(['user'], auth);

    return !!user?.data?.email;
}

export default useIsLogged;
