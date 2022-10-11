import { useFirestoreDocument } from '@react-query-firebase/firestore';
import { firestore } from 'config/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import { UseQueryOptions } from 'react-query';
import { Schema } from 'types/global';

export const schemaQueryKey = 'schema';

function useSchemaQuery(id?: string, options?: UseQueryOptions<any, any, any>) {
    const ref = (id ? doc(firestore, 'schemas', id) : null) as DocumentReference<Schema>;
    const query = useFirestoreDocument<Schema>(
        [schemaQueryKey, id],
        ref,
        {},
        {
            enabled: !!id,
            ...options,
        }
    );

    return query;
}
export default useSchemaQuery;
