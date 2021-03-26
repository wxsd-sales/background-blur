import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Button} from '@momentum-ui/react';
import {MEDIA_SETTINGS} from '../constants';
import {updateLocalStream, updateRemoteStream} from '../actions';

interface Props {
  blurMedia: () => Promise<any>,
  unblurMedia: () => any,
  meeting: any,
  meetingSDK: any,
  canvas: any,
  video: any,
  dest: string
  webexIsConnected: boolean,
  controls: any,
  updateLocalStream,
  updateRemoteStream
}

const Controls = (props: Props) => {
  const {blurMedia, canvas, dest, meeting, meetingSDK, unblurMedia, webexIsConnected, video} = props;
  const [disableBlur, updateDisableBlur] = useState(true);
  const [disableUnblur, updateDisableUnblur] = useState(true);
  const [disableJoin, updateDisableJoin] = useState(true);
  const [disableLeave, updateDisableLeave] = useState(true);
  const meetingIsCreated = meeting.localStream !== null;
  const meetingIsActive = meeting.remoteStream !== null;
  
  useEffect(() => {
    if(meetingIsCreated) {
      updateDisableBlur(false);
      updateDisableJoin(false);
    }

  }, [meeting.localStream]);

  const handleBlur = async (event) => {
    event.preventDefault();

    try {
      updateDisableUnblur(false);
      updateDisableBlur(true);
      
      if(meetingIsActive) {
        meetingSDK.updateVideo({
          stream: canvas.captureStream(),
          sendVideo: MEDIA_SETTINGS.sendVideo,
          receiveVideo: MEDIA_SETTINGS.receiveVideo
        })
      }

      // Last thing you want to do is to blur!
      await blurMedia();
    } catch(e) {
      console.log(e);
    }
  };

  const handleUnblur = (event) => {
    event.preventDefault();

    if(meetingIsActive) {
      meetingSDK.updateVideo({
        stream: meeting.localStream,
        sendVideo: MEDIA_SETTINGS.sendVideo,
        receiveVideo: MEDIA_SETTINGS.receiveVideo
      });
    }
    
    updateDisableBlur(false);
    updateDisableUnblur(true);
    unblurMedia();
  };
  
  const handleJoin = async (event) => {
    event.preventDefault();

    try {
      updateDisableLeave(false);
      updateDisableJoin(true);
      const newStream = disableBlur ? canvas.captureStream() : meeting.localStream;

      await meetingSDK.join(dest);
      await meetingSDK.addMedia({
        localStream: newStream,
        mediaSettings: MEDIA_SETTINGS
      });

    } catch(e) {
      console.log(e)
      updateDisableLeave(true);
      updateDisableJoin(false);
    }
  };

  const handleLeave = async (event) => {
    event.preventDefault();

    
    try {
      meetingSDK.leave();

      props.updateLocalStream(null);
      props.updateRemoteStream(null);

      updateDisableLeave(false);
      updateDisableBlur(true);
      updateDisableJoin(true);
    } catch (e) {
      console.log(e)
      updateDisableLeave(true);
    }
  };

  return (
    <div className="controls">
      <Button
        onClick={async (event) => await handleBlur(event)}
        color="purple"
        disabled={webexIsConnected ? disableBlur ? true : false : true}>
          Blur Background</Button>
      <Button
        onClick={(event) =>  handleUnblur(event)}
        color="yellow"
        disabled={webexIsConnected ? disableUnblur ? true : false : true}>
          Unblur Background</Button>
      <Button  
        onClick={async (event) => await handleJoin(event)} 
        disabled={webexIsConnected ? disableJoin ? true : false : true}
        color="green">
          Join Meeting</Button>
      <Button 
        onClick={async (event) => await handleLeave(event)}
        color="red"
        disabled={webexIsConnected ? disableLeave ? true : false : true}>
          Leave Meeting</Button>
    </div> 
  );
}

const mapStateToProps = state => ({
  controls: state.controls,
  dest: state.dest,
  webexIsConnected: state.webexIsConnected,
  meeting: state.meeting,
  meetingSDK: state.meetingSDK,
});

const mapDispatchToProps = {
  updateLocalStream,
  updateRemoteStream
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Controls);