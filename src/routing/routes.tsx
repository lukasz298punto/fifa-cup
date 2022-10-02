import React from 'react';
import { RouteList } from './types';

const Home = React.lazy(() => import('pages/Home'));
const PlayerList = React.lazy(() => import('pages/PlayerList'));
const SchemaList = React.lazy(() => import('pages/SchemaList'));
const SchemaDetail = React.lazy(() => import('pages/SchemaDetail'));
const PlayerDetail = React.lazy(() => import('pages/PlayerDetail'));

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
    TOURNAMENT: {
        path: '/tournament',
        component: PlayerList,
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
