import React from 'react';
import { oauth2 as SMART } from 'fhirclient';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * Typically the launch page is an empty page with a `SMART.authorize`
 * call in it.
 *
 * This example demonstrates that the call to authorize can be postponed
 * and called manually. In this case we use ReactRouter which will match
 * the `/launch` path and render our component. Then, after our page is
 * rendered we start the auth flow.
 */
export default class Launcher extends React.Component {
  /**
   * This is configured to make a Standalone Launch, just in case it
   * is loaded directly. An EHR can still launch it by passing `iss`
   * and `launch` url parameters
   */
  componentDidMount() {
    SMART.authorize({
      iss: 'https://launch.smarthealthit.org/v/r3/sim/eyJoIjoiMSIsImIiOiJzbWFydC0xNjQyMDY4IiwiZSI6InNtYXJ0LVByYWN0aXRpb25lci03MTYxNDUwMiJ9/fhir',
      redirectUri: '/home',
      clientId: 'whatever',
      scope: 'launch/patient offline_access openid fhirUser',

      // WARNING: completeInTarget=true is needed to make this work
      // in the codesandbox frame. It is otherwise not needed if the
      // target is not another frame or window but since the entire
      // example works in a frame here, it gets confused without
      // setting this!
      completeInTarget: true,
    });
  }
  /**
   * Could also return `null` for empty page
   */
  render() {
    return <LoadingSpinner loadingText='Launching...' />;
  }
}
