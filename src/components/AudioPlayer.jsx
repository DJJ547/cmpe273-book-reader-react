import React from 'react';
import ReactPlayer from 'react-player';
import audio from '../assets/statics/sample.wav';

const AudioPlayer = () => {
  return (
    <div>
      <h2>Audio Player</h2>
      <ReactPlayer
        url={audio} // Local or remote audio file
        controls={true}
        playing={false}
        width="100%"
        height="50px"
      />
    </div>
  );
};

export default AudioPlayer;
