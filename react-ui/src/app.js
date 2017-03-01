import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import superagent from 'superagent';

import './app.css';
import HerokuLogo from './heroku-logo';
import Spinner from './spinner';
import Predictions from './predictions';
import UploadTarget from './upload-target';

class App extends Component {

  state = {
    files: [],
    isProcessing: false,
    uploadError: null,
    uploadResponse: null
  }

  render() {
    const file = this.state.files[0];
    const uploadError = this.state.uploadError;
    const isProcessing = this.state.isProcessing;
    const response = this.state.uploadResponse;
    const predictions = (response && response.probabilities) || [];

    return (
      <div className="app">
        <div className="title-container">
          <div className="title-text">
            <h1 className="">Brand Recognizer</h1>
            <p>Powered by <a href="https://elements.heroku.com/addons/einstein-vision">
              {'Einstein Vision'}
            </a></p>
            <p className="detail-text">Example application of custom image recognition. Upload an image to identify if it contains the Heroku logo or supporting artwork.</p>
          </div>
          <div className="title-logo"><HerokuLogo/></div>
        </div>


        {!uploadError
          ? <div className="about">
              <ul>
                <li><a href="https://www.heroku.com/blog">Introduction</a></li>
                <li><a href="https://github.com/heroku/einstein-vision-node">GitHub</a></li>
                <li><a href="https://metamind.readme.io/v1/docs">API Docs</a></li>
              </ul>
            </div>
          : <p className="status-message status-message-error">
              {uploadError}
            </p>}

        <div className={classNames(
          file != null ? "app-with-image" : null)}>
          {response || isProcessing ? null : <Dropzone
            accept={'image/png, image/jpeg'}
            multiple={false}
            onDrop={this.onDrop}
            style={{}}
            className={classNames(
              'dropzone','initial-dropzone',
              file != null ? 'dropzone-dropped' : null
            )}
            activeClassName="dropzone-active"
            rejectClassName="dropzone-reject">
            <UploadTarget/>
          </Dropzone>}
          
          <Dropzone
              accept={'image/png, image/jpeg'}
              multiple={false}
              onDrop={this.onDrop}
              style={{}}
              className={classNames(
                'dropzone',
                file != null && !uploadError ? 'dropzone-dropped' : null
              )}
              activeClassName="dropzone-active"
              rejectClassName="dropzone-reject">
          <div className="result-wrapper">
              <div className={classNames(
                'image-preview',
                file != null && !uploadError ? 'image-preview-visible' : null)}>
                
                {isProcessing || response ? <img
                  alt="Upload preview"
                  src={file && file.preview}
                  style={{ display: 'block' }}/> : null}
                {!response || isProcessing ? null : 
                  <div className="prompt">Drop or tap to upload another</div>
                }
                <div className="spinner-wrapper">
                  {isProcessing
                    ? <span><Spinner/><div className="spinner-text">Analyzing Image...</div></span>
                    : null}
                </div>
              </div>
            
            <Predictions contents={predictions}/>
          </div>
          </Dropzone>
        </div>
      </div>
    );
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length) {
      this.setState({
        isProcessing: true,
        files: acceptedFiles,
        uploadError: null,
        uploadResponse: null
      });

      var req = superagent.post('/file-upload');
      acceptedFiles.forEach((file)=> {
        // Backend expects 'file' reference
        req.attach('file', file, file.name);
      });
      req.end((err,res) => {
        this.setState({ isProcessing: false });
        if (err) {
          console.log('file-upload error', err);
          this.setState({ uploadError: err.message });
          return;
        }
        console.log('file-upload response', res);
        this.setState({ uploadResponse: JSON.parse(res.text) });
      });
    }
  }
}

export default App;
