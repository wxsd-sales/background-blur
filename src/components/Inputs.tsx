import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Webex from 'webex';
import {Input, Button} from '@momentum-ui/react';
import {MEDIA_SETTINGS} from '../constants';
import {isWebexConnected, 
        isBlurButtonDisabled, 
        updateLocalStream, 
        updateRemoteStream,
        updateSDKMeeting,
        updateMeetingDest} from '../actions';

interface Props {
  webexIsConnected: boolean,
  meetingSDK: any,
  isBlurButtonDisabled: (isDisabled: boolean) => void,
  isWebexConnected: (isConnected: boolean) => void,
  updateRemoteStream: (stream: MediaStream) => void
  updateLocalStream: (stream: MediaStream) => void
  updateSDKMeeting: (sdk: any) => void,
  updateMeetingDest: (meetingDest: string) => void
}

const Inputs =  (props: Props) => {
  const [disableToken, updateDisableToken] = useState(false);
  const [tokenInputValue, updateTokenInputValue] = useState("");
  const [tokenMessage, updateTokenMessage] = useState({});
  const [token, updateToken] = useState("");
  const [disableAuth, updateDisableAuth] = useState(true);
  const [connectingToWebex, updateConnectingToWebex] = useState(false);
  const [disableDestInput, updateDisableDestInput] = useState(true);
  const [destMessage, updateDestMessage] = useState({});
  const [dest, updateDest] = useState("");
  const [disableCreate, updateDisableCreate] = useState(true);
  const [webexMeetings, updateWebexMeetings] = useState();

  useEffect(() => {
    const newToken = localStorage.getItem('token');

    if(newToken) {
      updateTokenInputValue(newToken);
      updateToken(newToken);
      updateDisableAuth(false);
    }
  }, []);

  const handleTokenChange = (event) => {
    const token = event.target.value;

    if(token === "") {
      updateDisableAuth(true);
      updateTokenMessage({message: 'Token is required!', type: 'error'});
    }
    else {
      updateDisableAuth(false);
      updateTokenMessage({});
      updateToken(token);
    }
  }

  const submitToken = async (event) => {
    event.preventDefault();

    await initWebex();
  }

  const initWebex = async () => {
    updateConnectingToWebex(true);
    updateDisableAuth(true);
    
    const webex = new Webex({
      credentials: token
    });

    updateWebexMeetings(webex.meetings);

    try {
      await webex.internal.device.register();
      await webex.internal.mercury.connect();
      await webex.meetings.register();
      await webex.meetings.syncMeetings();

      localStorage.setItem('token', token);

      props.isWebexConnected(true);
      updateDisableToken(true);
      updateDisableToken(true);
      updateDisableDestInput(false);
      updateTokenMessage({message: 'Authenticated!', type: 'success'})
    } catch (error) {

      props.isWebexConnected(false);
      updateDisableToken(false);
      updateDisableDestInput(true);
      updateTokenMessage({message: 'Not Authenticated!', type: 'error'})
    }

    updateConnectingToWebex(false);
  }

  const handleDestChange = (event) => {
    const msg = event.target.value;

    if(msg === "") {
      updateDisableCreate(true);
      updateDestMessage({message: 'Meeting Destination is required!', type: 'error'})
    } else {
      updateDisableCreate(false);
      updateDestMessage({});
      updateDest(msg)
      props.updateMeetingDest(msg);
    }
  }

  const startMedia = (media) => {
    if(media.type === 'remoteVideo') {
      props.updateRemoteStream(media.stream);
    }
  }

  const stopMedia = (media) => {
    if(media.type === 'remoteVide') {
      props.updateRemoteStream(null);
    } else if(media.type === 'localMedia') {
      props.updateLocalStream(null);
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      const meeting = await webexMeetings.create(dest);
      props.updateSDKMeeting(meeting);

      meeting.on('media:ready', (media) => startMedia(media));
      meeting.on('media:stopped', (media) => stopMedia(media));

      const [localStream, localShare] = await meeting.getMediaStreams(MEDIA_SETTINGS);
      props.updateLocalStream(localStream);

      props.isBlurButtonDisabled(false);
      updateDisableCreate(false);
    } catch (e) {
      console.log(e)
      updateDestMessage({message: 'Please input a valid meeting destination!', type: 'error'});
      updateDisableCreate(true);
      props.isBlurButtonDisabled(true);
    }
  }

  return (
    <div className="inputs">
     <div className="tokenSection">
       <div className="tokenInput">
          <Input 
            name="Token"
            label="Token"
            htmlId="Token"
            inputSize="small-5"
            disabled={disableToken}
            value={tokenInputValue}
            messageArr={[tokenMessage]}
            onChange={(event) => {handleTokenChange(event)}}
            placeholder="Your Access Token" />
       </div>
        <Button 
          disabled={disableAuth}
          onClick={async (event) => {await submitToken(event)}}
          color="green"
        >
          {connectingToWebex ? "Initiating..." : "Authenticate"}
        </Button>
    </div>
      <div className ="destSection" >
        <div className="destInput">
          <Input 
            name="Meeting Destination"
            label="Meeting Destination"
            htmlId="Meeting Destination"
            inputSize="small-5"
            disabled={disableDestInput}
            messageArr={[destMessage]}
            onChange={(event) => {handleDestChange(event)}}
            placeholder="roomID, peopleID, convoUrl, sipUri, meeting Link"
          />
        </div>
      <Button
        onClick={async (event) => await handleCreate(event)}
        color="blue"
        disabled={props.webexIsConnected ? disableCreate ? true : false : true}>
          Create
      </Button>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  webexIsConnected: state.webexIsConnected,
  meetingSDK: state.meetingSDK
});

const mapDispatchToProps = {
  isWebexConnected,
  isBlurButtonDisabled,
  updateLocalStream,
  updateRemoteStream,
  updateSDKMeeting,
  updateMeetingDest,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Inputs);