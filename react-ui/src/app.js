import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import superagent from 'superagent';
import classNames from 'classnames';
import './app.css';
import InfoLink from './info-link';
import UploadTarget from './upload-target';
import Predictions from './predictions';

class App extends Component {

  state = {
    files: [],
    isProcessing: false,
    uploadError: null,
    /* Example `uploadResponse`:
      {
        "probabilities": [
          {
            "label": "Heroku",
            "probability": 0.99
          },
          {
            "label": "infographic",
            "probability": 0.85
          },
          {
            "label": "street sign",
            "probability": 0.65
          },
          {
            "label": "digital clock",
            "probability": 0.20473432540893555
          },
          {
            "label": "odometer, hodometer, mileometer, milometer",
            "probability": 0.12954171001911163
          },
          {
            "label": "laptop, laptop computer",
            "probability": 0.07063886523246765
          },
          {
            "label": "cash machine, cash dispenser, automated teller machine, automatic teller machine, automated teller, automatic teller, ATM",
            "probability": 0.05539492145180702
          },
          {
            "label": "iPod",
            "probability": 0.04827757552266121
          }
        ],
        "object": "predictresponse"
      }
    */
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
          <h1>Metamind Image Identifier
            <InfoLink
              style={{
                float: 'right',
                height: '1.1rem',
                width: '1.1rem'
              }} 
              pathStyle={{ 
                fill: '#999'
              }}/></h1>
        </div>
        <div className="app">

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
            <UploadTarget/>
          </Dropzone>

          <div className={classNames(
              'status-message',
              (isProcessing || uploadError) ? 'status-message-visible' : null,
              uploadError ? 'status-message-error' : null)}>
            <p>{ uploadError
              ? uploadError
              : isProcessing
                ? 'Processing…' 
                : null }</p>
          </div>

          
          <div className={classNames(
              'image-preview',
              file != null ? 'image-preview-visible' : null)}
          ><img
              alt="upload preview"
              src={file && file.preview}
              style={{ display: 'block' }}/></div>

          <Predictions contents={predictions}/>

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
