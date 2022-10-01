import { useFirestoreCollectionMutation } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { collection, CollectionReference } from 'firebase/firestore';
import { SchemaFormInput } from 'pages/SchemaDetail';

function useSchemaMutation() {
    const ref = collection(firestore, 'schemas') as CollectionReference<SchemaFormInput>;
    const mutation = useFirestoreCollectionMutation(ref);

    return mutation;
}
export default useSchemaMutation;
