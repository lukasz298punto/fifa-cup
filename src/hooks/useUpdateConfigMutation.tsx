import { useFirestoreDocumentMutation } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import { Config } from 'types/global';

function useUpdateConfigMutation() {
    const ref = doc(firestore, 'config', 'global');
    const mutation = useFirestoreDocumentMutation(ref as DocumentReference<Config>);

    return mutation;
}
export default useUpdateConfigMutation;
