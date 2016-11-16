import React from 'react';
import ReactDOM from 'react-dom';
import UploadTarget from './upload-target';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UploadTarget />, div);
});
