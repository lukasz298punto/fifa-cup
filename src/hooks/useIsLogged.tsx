import { useAuthUser } from '@react-query-firebase/auth';
import { auth } from 'config/firebase';

export const playerQueryKey = 'config';

function useIsLogged() {
    const user = useAuthUser(['user'], auth);

    console.log(user?.data, 'user?.data');

    if (!user?.data === undefined) {
        return true;
    }

    return !!user?.data?.email;
}

export default useIsLogged;
