import React from 'react';
import {Inputs, Media} from './';
import {Button, Icon} from '@momentum-ui/react';


export default() => {
  const githubPage = 'https://github.com/WXSD-Sales/BlurBackground';
  return (
    <div className="content">
      <div className="header">
      <h2>Webex Browser SDK - Background Blur using TensorflowJS</h2>
      <Button circle color="blue" onClick={() => {window.open(githubPage, '_blank')}>
          <Icon name="info_18" />  
        </Button >
      </div>
      <Inputs />
      <Media />
    </div> 
  );
}