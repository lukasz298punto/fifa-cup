export type RouteList = {
    [Property in 'HOME' | 'PLAYER_LIST']: RouteConfig;
};

type PageComponent = () => JSX.Element;
export type RouteComponent = React.LazyExoticComponent<PageComponent> | PageComponent;
export type RouteConfig = {
    path: string;
    component: RouteComponent;
};
