import { useFirestoreDocumentMutation } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import { Player } from 'types/global';

function useUpdatePlayerMutation(id?: string) {
    const ref = id ? doc(firestore, 'players', id) : {};
    const mutation = useFirestoreDocumentMutation(ref as DocumentReference<Player>);

    return mutation;
}
export default useUpdatePlayerMutation;
