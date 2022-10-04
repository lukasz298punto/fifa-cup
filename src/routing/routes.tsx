import React from 'react';
import { RouteList } from './types';

const Home = React.lazy(() => import('pages/Home'));
const PlayerList = React.lazy(() => import('pages/PlayerList'));
const SchemaList = React.lazy(() => import('pages/SchemaList'));
const SchemaDetail = React.lazy(() => import('pages/SchemaDetail'));
const PlayerDetail = React.lazy(() => import('pages/PlayerDetail'));
const TournamentList = React.lazy(() => import('pages/TournamentList'));
const TournamentNew = React.lazy(() => import('pages/TournamentNew'));
const Statistics = React.lazy(() => import('pages/Statistics'));
const TournamentDetail = React.lazy(() => import('pages/TournamentDetail'));

export const routes: RouteList = {
    HOME: {
        path: '/',
        component: Home,
    },
    PLAYER_LIST: {
        path: '/players',
        component: PlayerList,
    },
    PLAYER_DETAIL: {
        path: '/players/:id',
        component: PlayerDetail,
    },
    TOURNAMENT_LIST: {
        path: '/tournaments',
        component: TournamentList,
    },
    TOURNAMENT_NEW: {
        path: '/tournaments/0',
        component: TournamentNew,
    },
    TOURNAMENT_DETAIL: {
        path: '/tournaments/:id',
        component: TournamentDetail,
    },
    STATISTICS: {
        path: '/statistics',
        component: Statistics,
    },
    SCHEMA_LIST: {
        path: '/schemas',
        component: SchemaList,
    },
    SCHEMA_DETAIL: {
        path: '/schemas/:id',
        component: SchemaDetail,
    },
};
