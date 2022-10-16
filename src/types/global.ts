import { DocumentReference } from 'firebase/firestore';

export type Fn = () => void;

export enum GroupStageType {
    Cup = '0',
    GroupStage = '1',
}

export type Player = {
    firstName: string;
    lastName: string;
    id?: string;
    active: 1 | 0;
};

export type Config = {
    nextTournamentDate: string | null;
};

export type Tournament = {
    endDate: string | null;
    startDate: string | null;
    name: string;
    schemaId: string;
};

export type Schema = {
    name: string;
    phases: {
        name: string;
        isGroupStage: GroupStageType;
        typeOfWin: number;
        pairCount?: string;
        groupCount?: number;
        groups?: { promotion?: number; playerCount: number }[];
    }[];
};

export type PlayerResult = { id: string; score: string; penaltyScore?: string };

export type Result = { playerA: PlayerResult; playerB: PlayerResult };

export type CupDetail = {
    results: Result[];
};

export type GroupDetail = {
    groups: {
        results: Result[];
        players: Omit<Player, 'active'>[];
    }[];
};

export type TournamentSchema = Tournament & {
    phases?: (CupDetail | GroupDetail)[];
};

export enum TypeOfWin {
    OneMatch = 1,
    TwoMatch = 2,
}
