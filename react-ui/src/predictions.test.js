import React from 'react';
import ReactDOM from 'react-dom';
import Predictions from './predictions';

it('renders without crashing', () => {
  const predictions = [
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
      "probability": 0.204
    },
    {
      "label": "odometer, hodometer, mileometer, milometer",
      "probability": 0.129
    },
    {
      "label": "iPod",
      "probability": 0.048
    }
  ]
  const div = document.createElement('div');
  ReactDOM.render(<Predictions contents={predictions} />, div);
});
