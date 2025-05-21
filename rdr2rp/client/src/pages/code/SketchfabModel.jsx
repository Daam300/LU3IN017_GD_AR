// src/components/SketchfabModel.jsx
import React from 'react';
import '../visual/SketchfabModel.css';

function SketchfabModel() {
  return (
    <div className="sketchfab-embed-wrapper">
      <iframe
        title="Six Shooter Outlaw"
        frameBorder="0"
        allowFullScreen
        mozAllowFullScreen="true"
        webkitAllowFullScreen="true"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        xr-spatial-tracking="true"
        execution-while-out-of-viewport="true"
        execution-while-not-rendered="true"
        web-share="true"
        width="100%"
        height="480"
        src="https://sketchfab.com/models/68f0fe9b6fa94c07a724cae7392bb2c5/embed"
      ></iframe>
    </div>
  );
}

export default SketchfabModel;
