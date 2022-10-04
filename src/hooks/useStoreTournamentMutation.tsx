import { useFirestoreCollectionMutation } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { collection, CollectionReference } from 'firebase/firestore';
import { Schema, Tournament } from 'types/global';

function useStoreTournamentMutation() {
    const ref = collection(firestore, 'tournaments') as CollectionReference<Tournament>;
    const mutation = useFirestoreCollectionMutation(ref);

    return mutation;
}

export default useStoreTournamentMutation;
