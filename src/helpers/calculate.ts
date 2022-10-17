import { matchStatus } from 'constants/global';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { getMatchStatus, getPkt, isCup } from 'helpers/global';
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
    find,
    compact,
    flatMap,
} from 'lodash';
import 'lodash.combinations';
import { CupDetail, GroupDetail, Player, Result, TournamentSchema } from 'types/global';

type MatchResult = {
    status: keyof typeof matchStatus;
    plus: number;
    minus: number;
    diff: number;
    pkt: number;
};

const joinDuplicate = (arr: Result[]) => {
    return reduce(
        arr,
        (acc: Result[], current) => {
            return find(acc, { playerA: { id: current.playerA.id } })
                ? map(acc, (value) => {
                      if (value.playerA.id === current.playerA.id) {
                          return {
                              ...value,
                              playerA: {
                                  ...value.playerA,
                                  score: String(
                                      parseInt(value.playerA.score) +
                                          parseInt(current.playerA.score)
                                  ),
                                  penaltyScore: String(
                                      parseInt(value.playerA?.penaltyScore || '0') +
                                          parseInt(current.playerA?.penaltyScore || '0')
                                  ),
                              },
                              playerB: {
                                  ...value.playerB,
                                  score: String(
                                      parseInt(value.playerB.score) +
                                          parseInt(current.playerB.score)
                                  ),
                                  penaltyScore: String(
                                      parseInt(value.playerB?.penaltyScore || '0') +
                                          parseInt(current.playerB?.penaltyScore || '0')
                                  ),
                              },
                          };
                      }
                      return value;
                  })
                : concat(acc, current);
        },
        []
    );
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

export const getAllPlayersResults = (playersIds: (string | undefined)[], results: Result[]) => {
    const resultList = map(compact(playersIds), (player) => {
        const playerResult = getAllResultsByPlayerId(player, results);

        return {
            id: player,
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

const getSequence = (result: CupDetail | GroupDetail) => {
    if (isCup(result)) {
        const results = reduce(
            joinDuplicate(result?.results),
            (acc, { playerA, playerB }) => {
                if (playerA.score > playerB.score) {
                    return {
                        winners: concat(acc.winners, playerA.id),
                        losers: concat(acc.losers, playerB.id),
                    };
                }

                if (playerB.score > playerA.score) {
                    return {
                        winners: concat(acc.winners, playerB.id),
                        losers: concat(acc.losers, playerA.id),
                    };
                }

                if (
                    playerA.score === playerB.score &&
                    !isNil(playerA.penaltyScore) &&
                    !isNil(playerB.penaltyScore)
                ) {
                    return {
                        winners: concat(
                            acc.winners,
                            playerA.penaltyScore > playerB.penaltyScore ? playerA.id : playerB.id
                        ),
                        losers: concat(
                            acc.losers,
                            playerA.penaltyScore < playerB.penaltyScore ? playerA.id : playerB.id
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

        return map(getAllPlayersResults(map(allGroups.players, 'id'), allGroups.results), 'id');
    }
};

export const getTournamentSequence = (phases: (CupDetail | GroupDetail)[] | undefined) => {
    if (!phases) return [];

    return reduce(
        flatten(map(reverse(phases), getSequence)),
        (acc, current) => {
            return includes(acc, current) ? acc : concat(acc, current);
        },
        [] as string[]
    );
};

export const getAllResults = (docs: QueryDocumentSnapshot<TournamentSchema>[] | undefined) =>
    flatten(
        flatMap(docs, (tour) => {
            const data = tour.data();

            return map(data.phases, (phase) => {
                if (isCup(phase)) {
                    return phase.results;
                } else {
                    return flatMap(phase.groups, (group) => group.results);
                }
            });
        })
    );
