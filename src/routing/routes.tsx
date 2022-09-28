import React from 'react';
import { RouteList } from './types';

const Home = React.lazy(() => import('pages/Home'));
const PlayerList = React.lazy(() => import('pages/PlayerList'));
const CupCreator = React.lazy(() => import('pages/CupCreator'));

export const routes: RouteList = {
    HOME: {
        path: '/',
        component: Home,
    },
    PLAYER_LIST: {
        path: '/player-list',
        component: PlayerList,
    },
    CUP_CREATOR: {
        path: '/cup-creator',
        component: CupCreator,
    },
};
