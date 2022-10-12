import { useFirestoreDocumentMutation } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import { Player, Tournament } from 'types/global';

function useUpdatePlayerMutation(id: string) {
    const ref = doc(firestore, 'tournaments', id);
    const mutation = useFirestoreDocumentMutation(ref as DocumentReference<Tournament>);

    return mutation;
}
export default useUpdatePlayerMutation;
