import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";

import './index.css';
import App from './App';

const client = new ApolloClient({
  // API endpoint
  uri: "http://localhost:8008/graphql",
  // middleware to inject auth header on all requests
  // request: operation => operation.setContext({
  //   headers: {
  //     authorization: `Bearer ${localStorage.getItem('token')}`,
  //   }
  // }),
});

ReactDOM.render(
  (
    // ApolloProvider provides 'client' access to children through React context
      // client provides mechanism for making requests against the GraphQL API
    // enables Query, Mutation, and ApolloConsumer wrapper components usage
    <ApolloProvider client={client} >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  ),
  document.getElementById('root'),
);

/**
 * Apollo-React Wrapper Components
 * -------------------------------
 * 
 * Query Component - props: [query, variables]
 *   used for: on load query data injection
 *   makes a query request and injects data into wrapped component
 *   handles loading, error, and data injection rendering logic
 * 
 * Mutation Component -  props: [mutation, variables]
 *   used for: on load or on call mutation request
 *   injects a callable mutation function into wrapped component
 *     mutation function can be called on load or by callback trigger
 *   handles loading, error, and response data rendering logic
 *  
 * ApolloConsumer Component - props: [query, mutation, variables]
 *   used for: conditionally making a query or mutation request
 *   injects a callable query/mutation function into wrapped component
 *   manual handling of loading, error, and setState with response data 
 */
