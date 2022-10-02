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
