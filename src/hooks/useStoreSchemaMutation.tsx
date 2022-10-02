import { useFirestoreCollectionMutation } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { collection, CollectionReference } from 'firebase/firestore';
import { Schema } from 'types/global';

function useStoreSchemaMutation() {
    const ref = collection(firestore, 'schemas') as CollectionReference<Schema>;
    const mutation = useFirestoreCollectionMutation(ref);

    return mutation;
}

export default useStoreSchemaMutation;
