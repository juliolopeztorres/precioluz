import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DefaultView from '../View/DefaultView';

type routes = 'home' | 'mock';

export default function RouteService() {
  return (
    <div className="App">
      <Switch>
        <Route exact path={getRoute('home')}>
          <DefaultView/>
        </Route>

        <h1>404 - Página no encontrada :(</h1>
      </Switch>
    </div>
  );
}

export function getRoute(path: routes): string {
  // generatePath('/'), // generatePath(path, parameters) -> Path string and parameters an object
  const routes = {
    home: {
      route: "/",
    },
  };

  return routes[path].route;
}
