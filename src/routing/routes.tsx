import React from 'react';
import { RouteList } from './types';

const Home = React.lazy(() => import('pages/Home'));
const PlayerList = React.lazy(() => import('pages/PlayerList'));

export const routes: RouteList = {
    HOME: {
        path: '/',
        component: Home,
    },
    PLAYER_LIST: {
        path: '/player-list',
        component: PlayerList,
    },
};
