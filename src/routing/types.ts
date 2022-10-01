export type RouteList = {
    [Property in 'HOME' | 'PLAYERS' | 'TOURNAMENT' | 'SCHEMA_LIST' | 'SCHEMA_DETAIL']: RouteConfig;
};

type PageComponent = () => JSX.Element;
export type RouteComponent = React.LazyExoticComponent<PageComponent> | PageComponent;
export type RouteConfig = {
    path: string;
    component: RouteComponent;
};
