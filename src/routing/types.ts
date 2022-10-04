export type RouteList = {
    [Property in
        | 'HOME'
        | 'PLAYER_LIST'
        | 'SCHEMA_LIST'
        | 'PLAYER_DETAIL'
        | 'TOURNAMENT_LIST'
        | 'TOURNAMENT_DETAIL'
        | 'STATISTICS'
        | 'TOURNAMENT_NEW'
        | 'SCHEMA_DETAIL']: RouteConfig;
};

type PageComponent = () => JSX.Element;
export type RouteComponent = React.LazyExoticComponent<PageComponent> | PageComponent;
export type RouteConfig = {
    path: string;
    component: RouteComponent;
};
