import React from 'react';
import { oauth2 as SMART } from 'fhirclient';
import { FhirClientContext } from '../utils/FhirClientContext';
import { LoadingSpinner } from './LoadingSpinner';

export default class FhirClientProvider extends React.Component {
  componentDidMount() {
    SMART.ready().then(
      (client) => this.setState({ client }),
      (error) => this.setState({ error })
    );
  }

  render() {
    return (
      <FhirClientContext.Provider value={this.state || {}}>
        <FhirClientContext.Consumer>
          {({ client, error }: any) => {
            // any error that SMART.ready() may have been rejected with
            if (error) {
              return <pre>{error.stack}</pre>;
            }

            // if client is already available render the subtree
            if (client) {
              return this.props.children;
            }

            // client is undefined until SMART.ready() is fulfilled
            return <LoadingSpinner loadingText='Authorizing...' />;
          }}
        </FhirClientContext.Consumer>
      </FhirClientContext.Provider>
    );
  }
}
