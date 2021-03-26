import React, {useState, useEffect} from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import {Controls} from './';
import {connect} from 'react-redux';
import {updateBlurredCanvas} from '../actions';

interface Props {
  updateBlurredCanvas: (update: boolean) => void,
  blurredCanvasIsAvailable: boolean,
  meeting: any
}

const Media =  (props: Props) => {
  const videoHeight = "180px";
  const videoWidth = "320px";
  const {meeting} = props;
  const meetingIsActive = meeting.remoteStream !== null;
  const [videoIsLoaded, updateVideoIsLoaded] = useState(false);
  const [localVideo, updateLocalVideo] = useState({} as HTMLVideoElement);
  const [remoteVideo, updateRemoteVideo] = useState({} as HTMLVideoElement);
  const [canvas, updateCanvas] = useState({} as HTMLCanvasElement);
  
  useEffect(() => {
    if(meetingIsActive) {
      remoteVideo.srcObject = meeting.remoteStream;
    }

  }, [meeting.remoteStream]);

  const getLocalStream = (node) => {
    if (node !== null && meeting.localStream instanceof MediaStream) {
      updateLocalVideo(node);
      node.srcObject = meeting.localStream;
    }
  }

  const handleLoadedVideo = (event) => {
    updateVideoIsLoaded(true);
  }

 const getRemoteStream = (node) =>{
    updateRemoteVideo(node);
  }

  const getCanvas = (canvas) => {
    updateCanvas(canvas);
  }

  const handleBlur = async () => {
    const options = {
      multiplier: 0.75,
      stride: 32,
      quantBytes: 1
    }
    
    localVideo.hidden = true;
    
    const person = await bodyPix.load(options)
    
    await perform(person);
  }

  const handleUnblur =  () => {
    localVideo.hidden = false;
  }
  
  const perform = async (net) => {
    while (localVideo.hidden) {
      const segmentation = await net.segmentPerson(localVideo);
  
      const backgroundBlurAmount = 2;
      const edgeBlurAmount = 2;
      const flipHorizontal = false;

      bodyPix.drawBokehEffect(
        canvas, localVideo, segmentation, backgroundBlurAmount,
        edgeBlurAmount, flipHorizontal);
    }
  }

    return (
      <div className="media" >
        <div className="screens">
          <div className="local">
            <h3>Local Stream</h3> 
            <div>
              <div className="localVideo">
                <video 
                  ref={getLocalStream} 
                  playsInline 
                  autoPlay 
                  width={videoWidth} 
                  height={videoHeight}
                />
              </div>
              <canvas
                ref={getCanvas} 
                width={videoWidth} 
                height={videoHeight}
              />
            </div>
          </div>
          <div className="remote">
            <h3>Remote Stream</h3> 
            <video 
              ref={getRemoteStream} 
              playsInline 
              autoPlay 
              width={videoWidth} 
              height={videoHeight} />
          </div>
        </div>
        <Controls 
          blurMedia={handleBlur}
          unblurMedia={handleUnblur}
          canvas={canvas}
          video={localVideo}
        />
      </div>
    );
  
}


const mapStateToProps = state => ({
  meeting: state.meeting,
  blurredCanvasIsAvailable: state.blurredCanvasIsAvailable
});

const mapDispatchToProps = {
  updateBlurredCanvas
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Media);