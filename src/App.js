import { Suspense } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { renderRoutes } from "./config/routes";

import "./App.scss";

function App() {
  return (
    <div className="App">
      <Suspense fallback={"...loading"}>
        <BrowserRouter>
          <Switch>
            {renderRoutes.map(([key, route]) => {
              return (
                <route.type
                  key={key}
                  exact
                  render={() => <route.component />}
                  path={route.path}
                />
              );
            })}
          </Switch>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
