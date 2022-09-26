import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
    apiKey: 'AIzaSyDmP6tCYEZytAbW6jYt2ODmGl5LEikN1y8',
    authDomain: 'fifa-sekowa-cup.firebaseapp.com',
    projectId: 'fifa-sekowa-cup',
    storageBucket: 'fifa-sekowa-cup.appspot.com',
    messagingSenderId: '978013300248',
    appId: '1:978013300248:web:c52c9632bef933a044856d',
};

const firebase = initializeApp(firebaseConfig);

export const firestore = getFirestore(firebase);
