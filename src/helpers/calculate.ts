import { matchStatus } from 'constants/global';
import { getMatchStatus, getPkt } from 'helpers/global';
import {
    concat,
    filter,
    flatten,
    includes,
    map,
    reduce,
    reverse,
    size,
    orderBy,
    isNil,
} from 'lodash';
import 'lodash.combinations';
import { CupDetail, GroupDetail, Player, Result } from 'types/global';

type MatchResult = {
    status: keyof typeof matchStatus;
    plus: number;
    minus: number;
    diff: number;
    pkt: number;
};

export const getAllResultsByPlayerId = (id: string, results: Result[]) =>
    reduce(
        results,
        (acc: MatchResult[], { playerA, playerB }) => {
            if (playerA.score && playerB.score) {
                if (playerA.id === id) {
                    return concat(acc, {
                        status: getMatchStatus(parseInt(playerA.score) - parseInt(playerB.score)),
                        plus: parseInt(playerA.score),
                        minus: parseInt(playerB.score),
                        diff: parseInt(playerA.score) - parseInt(playerB.score),
                        pkt: getPkt(parseInt(playerA.score) - parseInt(playerB.score)),
                    });
                }

                if (playerB.id === id) {
                    return concat(acc, {
                        status: getMatchStatus(parseInt(playerB.score) - parseInt(playerA.score)),
                        plus: parseInt(playerB.score),
                        minus: parseInt(playerA.score),
                        diff: parseInt(playerB.score) - parseInt(playerA.score),
                        pkt: getPkt(parseInt(playerB.score) - parseInt(playerA.score)),
                    });
                }
            }

            return acc;
        },
        []
    );

export const getAllPlayersResults = (players: Omit<Player, 'active'>[], results: Result[]) => {
    const resultList = map(players, (player) => {
        const playerResult = getAllResultsByPlayerId(player?.id as string, results);

        return {
            id: player?.id || '',
            pkt: reduce(playerResult, (acc, { pkt }) => acc + pkt, 0),
            m: size(playerResult),
            w: size(filter(playerResult, { status: matchStatus.W })),
            r: size(filter(playerResult, { status: matchStatus.D })),
            p: size(filter(playerResult, { status: matchStatus.L })),
            brPlus: reduce(playerResult, (acc, { plus }) => acc + plus, 0),
            brMinus: reduce(playerResult, (acc, { minus }) => acc + minus, 0),
            brDiff: reduce(playerResult, (acc, { diff }) => acc + diff, 0),
        };
    });

    return orderBy(resultList, ['pkt', 'brDiff', 'brPlus'], ['desc', 'desc', 'desc']);
};

const isCup = (value: CupDetail | GroupDetail): value is CupDetail => 'results' in value;

const getSequence = (result: CupDetail | GroupDetail) => {
    if (isCup(result)) {
        const results = reduce(
            result?.results,
            (acc, current) => {
                if (current.playerA.score > current.playerB.score) {
                    console.log(current.playerA, 'current.playerA');
                    return {
                        winners: concat(acc.winners, current.playerA.id),
                        losers: concat(acc.winners, current.playerB.id),
                    };
                }

                if (current.playerB.score > current.playerA.score) {
                    return {
                        winners: concat(acc.winners, current.playerB.id),
                        losers: concat(acc.winners, current.playerA.id),
                    };
                }

                if (
                    current.playerA.score === current.playerB.score &&
                    !isNil(current.playerA.penaltyScore) &&
                    !isNil(current.playerB.penaltyScore)
                ) {
                    return {
                        winners: concat(
                            acc.winners,
                            current.playerA.penaltyScore > current.playerB.penaltyScore
                                ? current.playerA.id
                                : current.playerB.id
                        ),
                        losers: concat(
                            acc.losers,
                            current.playerA.penaltyScore < current.playerB.penaltyScore
                                ? current.playerA.id
                                : current.playerB.id
                        ),
                    };
                }

                return acc;
            },
            {
                winners: [] as string[],
                losers: [] as string[],
            }
        );

        console.log(results, 'results`1```````````````');
        return [...results.winners, ...results.losers];
    } else {
        const allGroups = reduce(
            result.groups,
            (acc, current) => {
                return {
                    players: concat(acc.players, current.players),
                    results: concat(acc.results, current.results),
                };
            },
            { players: [] as Omit<Player, 'active'>[], results: [] as Result[] }
        );

        return map(getAllPlayersResults(allGroups.players, allGroups.results), 'id');
    }
};

export const getTournamentSequence = (phases: (CupDetail | GroupDetail)[] | undefined) => {
    if (!phases) return [];

    console.log(reverse(phases), 'ddxxx---------');

    return reduce(
        flatten(map(reverse(phases), getSequence)),
        (acc, current) => {
            return includes(acc, current) ? acc : concat(acc, current);
        },
        [] as string[]
    );
};
