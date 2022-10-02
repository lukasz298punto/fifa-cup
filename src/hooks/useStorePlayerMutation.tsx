import {
    useFirestoreCollectionMutation,
    useFirestoreDocumentMutation,
} from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { collection, CollectionReference, doc, DocumentReference } from 'firebase/firestore';
import { Player } from 'types/global';

function useStorePlayerMutation() {
    const ref = collection(firestore, 'players') as CollectionReference<Player>;
    const mutation = useFirestoreCollectionMutation(ref);

    return mutation;
}
export default useStorePlayerMutation;
