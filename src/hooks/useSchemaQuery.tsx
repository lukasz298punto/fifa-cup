import {
    useFirestoreCollectionMutation,
    useFirestoreDocument,
    useFirestoreQuery,
} from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { collection, CollectionReference, doc, DocumentReference, query } from 'firebase/firestore';
import { SchemaFormInput } from 'pages/SchemaDetail';
import { UseQueryOptions } from 'react-query';

export const schemaQueryKey = 'schema';

function useSchemaQuery(id: string, options?: UseQueryOptions<any, any, any>) {
    const ref = doc(firestore, 'schemas', id) as DocumentReference<SchemaFormInput>;
    const query = useFirestoreDocument<SchemaFormInput>([schemaQueryKey, id], ref, {}, options);

    // const ref = collection(firestore, 'schemas') as CollectionReference<SchemaFormInput>;
    // const query = useFirestoreQuery<SchemaFormInput>([schemaListQueryKey], ref);

    return query;
}
export default useSchemaQuery;
