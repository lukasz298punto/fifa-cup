import { CircularProgress } from '@mui/material';
import { Base } from 'layout/Base';
import { map } from 'lodash';
import { NotFound } from 'pages';
import React from 'react';
import { BrowserRouter, Route, Routes, HashRouter } from 'react-router-dom';
import { routes } from './routes';

export const routePrefix = '/fifa-cup';

function Router() {
    return (
        <HashRouter>
            <Routes>
                <Route element={<Base />}>
                    {map(routes, ({ path, component: Component }) => (
                        <Route
                            key={path}
                            path={path}
                            element={
                                <React.Suspense fallback={<CircularProgress size={24} />}>
                                    <Component />
                                </React.Suspense>
                            }
                        />
                    ))}
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </HashRouter>
    );
}

export default Router;
