import { Base } from 'layout/Base';
import { map } from 'lodash';
import { NotFound } from 'pages';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { routes } from './routes';

export const routePrefix = '/fifa-cup';

function Router() {
    return (
        <BrowserRouter basename={routePrefix}>
            <Routes>
                <Route element={<Base />}>
                    {map(routes, ({ path, component: Component }) => (
                        <Route
                            key={path}
                            path={path}
                            element={
                                <React.Suspense fallback={'ladowanie....'}>
                                    <Component />
                                </React.Suspense>
                            }
                        />
                    ))}
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
