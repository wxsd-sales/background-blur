import {combineReducers} from 'redux';
import {IS_WEBEX_CONNECTED,
        IS_BLUR_BUTTON_DISABLED, 
        UPDATE_LOCAL_STREAM, 
        UPDATE_REMOTE_STREAM,
        UPDATE_MEETING_DEST,
        UPDATE_MEETING_SDK,
        BLURRED_CANVAS_IS_AVAILABLE} from './constants';

const webexIsConnected = (state=false, action): boolean => {
  switch(action.type) {
    case IS_WEBEX_CONNECTED:
      return action.value;
    default:
      return state;
  }
}

const controls = (state={disableBlur: false}, action): any => {
  switch(action.type) {
    case IS_BLUR_BUTTON_DISABLED:
      return {
        disableBlur: action.value
      }
    default:
      return state;
  }

}

const meeting = (state={localStream: null, remoteStream: null}, action): any => {
  switch(action.type) {
    case UPDATE_LOCAL_STREAM:
      return {
        ...state,
        localStream: action.value
      };
    case UPDATE_REMOTE_STREAM:
      return {
        ...state,
        remoteStream: action.value
      }
    default:
      return state;
  }
}

const meetingSDK = (state={}, action): any => {
  switch(action.type) {
    case UPDATE_MEETING_SDK:
      return action.value;
    default:
      return state;
  }
}

const meetingDest = (state="", action): any => {
  switch(action.type) {
    case UPDATE_MEETING_DEST:
      return action.value;
    default:
      return state
  }
}

const blurredCanvasIsAvailable = (state=false, action): any => {
  switch(action.type) {
    case BLURRED_CANVAS_IS_AVAILABLE:
      return action.value;
    default:
      return state;
  }
}

export default combineReducers({
  webexIsConnected,
  controls,
  meeting,
  meetingSDK,
  meetingDest,
  blurredCanvasIsAvailable,
});