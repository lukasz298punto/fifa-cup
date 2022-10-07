import { matchStatus } from 'constants/global';
import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { find } from 'lodash';
import { Player } from 'types/global';

export const getMatchStatus = (score: number) => {
    if (score === 0) return matchStatus.D;

    return score > 0 ? matchStatus.W : matchStatus.L;
};

export const getPkt = (score: number) => {
    if (score === 0) return 1;

    return score > 0 ? 3 : 0;
};

export const findPlayerNameById = (
    id: string,
    docs: QueryDocumentSnapshot<Player>[] | undefined
) => {
    const player = find(docs, { id: id })?.data();

    return player?.firstName + ' ' + player?.lastName;
};
