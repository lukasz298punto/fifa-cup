import { useFirestoreDocument } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import { UseQueryOptions } from 'react-query';
import { Schema } from 'types/global';

export const schemaQueryKey = 'schema';

function useSchemaQuery(id: string, options?: UseQueryOptions<any, any, any>) {
    const ref = doc(firestore, 'schemas', id) as DocumentReference<Schema>;
    const query = useFirestoreDocument([schemaQueryKey, id], ref, {}, options);

    return query;
}
export default useSchemaQuery;
