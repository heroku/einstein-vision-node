import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import superagent from 'superagent';

import './app.css';
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
      <div>
        <div className="title">
          <h1 className="intro">
             Einstein Vision Demo
             <div className="detail">of the General Image Classifier</div>
          </h1>
        </div>
        <div className={classNames(
          "app",
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
                file != null ? 'dropzone-dropped' : null
              )}
              activeClassName="dropzone-active"
              rejectClassName="dropzone-reject">
          <div className="result-wrapper">
              <div className={classNames(
                'image-preview',
                file != null ? 'image-preview-visible' : null)}>
                
                {isProcessing || response ? <img
                  alt="Upload preview"
                  src={file && file.preview}
                  style={{ display: 'block' }}/> : null}
                {!response || isProcessing ? null : 
                  <div className="prompt">Drop or tap to upload another.</div>
                }
                <div className="spinner-wrapper">
                  {isProcessing
                    ? <span><Spinner/><div className="spinner-text">Analyzing Image...</div></span>
                    : null}
                  {uploadError
                    ? uploadError
                    :null}
                </div>
              </div>
            
            <Predictions contents={predictions}/>
          </div>
          </Dropzone>
        </div>

        <div className="footer">
          <a href="https://github.com/heroku/einstein-vision-node">GitHub</a>
          <a href="https://metamind.readme.io/v1/docs">API Docs</a>
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
