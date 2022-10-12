import { useFirestoreDocument } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import { UseQueryOptions } from 'react-query';
import { Schema, Tournament, TournamentSchema } from 'types/global';

export const tournamentQueryKey = 'tournament';

function useTournamentQuery(id: string) {
    const ref = doc(firestore, 'tournaments', id) as DocumentReference<TournamentSchema>;
    const query = useFirestoreDocument(
        [tournamentQueryKey, id],
        ref,
        {},
        { refetchInterval: 10000 }
    );

    return query;
}
export default useTournamentQuery;
