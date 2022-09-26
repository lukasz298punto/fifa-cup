import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore';
import { useEffect } from 'react';
import React from 'react';
import logo from './logo.svg';
import { getDatabase, child, get } from 'firebase/database';
import { useDatabaseSnapshot } from '@react-query-firebase/database';
import './App.css';
import { initializeApp } from 'firebase/app';
import { firestore } from 'config/firebase';
import { map } from 'lodash';
import {
    useFirestoreCollectionMutation,
    useFirestoreDocument,
    useFirestoreQuery,
} from '@react-query-firebase/firestore';

const ref = collection(firestore, 'players');

function App() {
    const ref = query(collection(firestore, 'players'));
    const cupRef = query(collection(firestore, 'cup'));
    const { data, isLoading } = useFirestoreQuery(['players'], ref);
    const { data: data1 } = useFirestoreQuery(['cup'], cupRef);
    // console.log(data, 'query.data');
    // console.log(ref, 'ref');
    map(data1?.docs, (docSnapshot: any) => {
        const data = docSnapshot.data();
        console.log(data?.players?.[0].id, 'docSnapshot123');
        return 1111;
    });

    const ref123 = doc(firestore, 'players', 'NqEQb9V0c9JPxDvKWP3o');
    const product = useFirestoreDocument(['players', 'NqEQb9V0c9JPxDvKWP3o'], ref123);

    useEffect(() => {
        getDoc(ref123).then((res) => {
            console.log(res.data(), 'res');
        });
    }, []);

    const refmut = collection(firestore, 'cup');
    const mutation = useFirestoreCollectionMutation(refmut);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <button
                disabled={mutation.isLoading}
                onClick={() => {
                    mutation.mutate({
                        name: 'New product!',
                        price: 10,
                        ref: ref123,
                    });
                }}
            >
                Add document
            </button>
            {mutation.isError && <p>{mutation.error.message}</p>}
            {map(data?.docs, (docSnapshot: any) => {
                const data = docSnapshot.data();
                console.log(docSnapshot, 'docSnapshot');
                return <div key={data?.name}>{data?.name}</div>;
            })}
        </>
    );
}

export default App;
