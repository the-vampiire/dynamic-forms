import React from 'react';
import { Switch, Route } from "react-router-dom";

import Landing from "./components/Landing";
import { DynamicForm } from "./components/DynamicForm";

// TODO: add Header for navigation
const App = () => (
  <Switch>
    <Route exact path="/" component={Landing} />

    <Route
      exact path="/form/:purpose?/:version?"
      render={
        ({ match: { params: { purpose, version } } }) => (
          <DynamicForm
            purpose={purpose || "example"}
            version={version} // defaults to latest version
          />
        )
      }
    />

    <Route
      exact path="/form/qs/:purpose?/:version?"
      render={
        ({
          match: { params: { purpose, version } },
          location: { search },
        }) => (
          <DynamicForm
            purpose={purpose || "example"}
            version={version} // defaults to latest version
            queryString={search}
          />
        )
      }
    />

    {/* <Route
      exact path="/form/hidden/:version?"
      render={
        ({ match: { params: { version } } }) => (
          <DynamicFormWrapper
            version={version} // defaults to latest version
          />
        )
      }
    /> */}
  </Switch>
);

export default App;
