import { useFirestoreDocument, useFirestoreQuery } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import { UseQueryOptions } from 'react-query';
import { Schema, Tournament, TournamentSchema } from 'types/global';

export const tournamentQueryKey = 'tournament';

function useTournamentQuery(id: string) {
    const ref = doc(firestore, 'tournaments', id);
    const query = useFirestoreQuery([tournamentQueryKey, id], ref as any, { subscribe: true });

    return query as any;
}
export default useTournamentQuery;
