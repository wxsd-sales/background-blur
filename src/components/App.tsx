import React from 'react';
import {Button, Input, Spinner, Icon} from '@momentum-ui/react';
import {Inputs, Media} from './';

export default class App extends React.Component<any, any> {
  webex: any;
  meeting: any;
  option: any;
  canvas: any;
  localStream: any;
  remoteStream: any;
  mediaSettings: any;
  videoWidth: string;
  videoHeight: string;

  constructor(props) {
    super(props);
  }

  async componentWillUnmount() {
    try {
      await this.webex.meetings.unregister();
      await this.webex.internal.mercury.disconnect();
      await this.webex.internal.device.unregister();

    } catch (e) {
      console.log(`Webex Disconnection Error: ${e}`);
    }
  }

  render() {
    return (
      <div className="content">
        <h2>Blur Background Webex Meeting Feature</h2>
        <Inputs />
        <Media />
      </div> 
    );
  }
}