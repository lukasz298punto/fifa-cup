import React from 'react';
import { RouteList } from './types';

const Home = React.lazy(() => import('pages/Home'));
const Players = React.lazy(() => import('pages/Players'));
const SchemaList = React.lazy(() => import('pages/SchemaList'));
const SchemaDetail = React.lazy(() => import('pages/SchemaDetail'));

export const routes: RouteList = {
    HOME: {
        path: '/',
        component: Home,
    },
    PLAYERS: {
        path: '/players',
        component: Players,
    },
    TOURNAMENT: {
        path: '/tournament',
        component: Players,
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
