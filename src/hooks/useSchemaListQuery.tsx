import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { collection, CollectionReference } from 'firebase/firestore';
import { SchemaFormInput } from 'pages/SchemaDetail';

export const schemaListQueryKey = 'schemas';

function useSchemaListQuery() {
    const ref = collection(firestore, 'schemas') as CollectionReference<SchemaFormInput>;
    const query = useFirestoreQuery<SchemaFormInput>([schemaListQueryKey], ref);

    return query;
}
export default useSchemaListQuery;
