import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { collection, CollectionReference } from 'firebase/firestore';
import { Schema } from 'types/global';

export const schemaListQueryKey = 'schemas';

function useSchemaListQuery() {
    const ref = collection(firestore, 'schemas') as CollectionReference<Schema>;
    const query = useFirestoreQuery<Schema>([schemaListQueryKey], ref);

    return query;
}
export default useSchemaListQuery;
