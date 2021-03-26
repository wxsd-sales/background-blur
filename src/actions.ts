import {IS_WEBEX_CONNECTED,
  IS_BLUR_BUTTON_DISABLED, 
  UPDATE_LOCAL_STREAM, 
  UPDATE_REMOTE_STREAM,
  UPDATE_MEETING_SDK,
  UPDATE_MEETING_DEST,
  BLURRED_CANVAS_IS_AVAILABLE} from './constants';


export const isWebexConnected = (isConnected: boolean) =>
  ({
    type: IS_WEBEX_CONNECTED,
    value: isConnected
  });

  export const isBlurButtonDisabled = (isDisabled: boolean) => 
  ({
    type: IS_BLUR_BUTTON_DISABLED,
    value: isDisabled
  });

  export const updateLocalStream = (stream: MediaStream) => ({
    type: UPDATE_LOCAL_STREAM,
    value: stream
  });

  export const updateRemoteStream = (stream: MediaStream) => ({
    type: UPDATE_REMOTE_STREAM,
    value: stream
  });

  export const updateSDKMeeting = (sdk: any) => ({
    type: UPDATE_MEETING_SDK,
    value: sdk
  });

  export const updateMeetingDest = (meetingDest: string) => ({
    type: UPDATE_MEETING_DEST,
    value: meetingDest
  });

  export const updateBlurredCanvas = (isBlurred: boolean) => ({
    type: BLURRED_CANVAS_IS_AVAILABLE,
    value: isBlurred
  });