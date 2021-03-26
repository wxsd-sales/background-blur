import {createStore, StoreEnhancer} from 'redux';
import reducers from './reducers';

interface State {
  controls: any,
  meeting: {
    localStream: MediaStream,
    remoteStream: MediaStream
  }
  meetingSDK: any,
  meetingDest: string,
  webexIsConnected: boolean,
  blurredCanvasIsAvailable: boolean
}

const initialState = <State> {
  controls: {
    disableBlur: true
  },
  meeting: {
    localStream: null,
    remoteStream: null,
  },
  meetingSDK: {},
  meetingDest: "",
  webexIsConnected: false,
  blurredCanvasIsAvailable: false,
};

const configureStore = (initialStore) => createStore(reducers, initialStore);

export default configureStore(initialState);