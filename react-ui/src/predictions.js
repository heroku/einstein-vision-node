import React, { Component } from 'react';
import './predictions.css';
import { StaggeredMotion, spring } from 'react-motion';

class Predictions extends Component {
  static propTypes = {
    // The Metamind Predictions
    contents: React.PropTypes.array.isRequired
  }

  render() {
    const contents = this.props.contents;
    if (contents == null || contents.length === 0) {
      return <div className="empty"/>;
    }

    return (<StaggeredMotion
      defaultStyles={contents.map( p => ({maxHeight: 0}))}
      styles={prevInterpolatedStyles => 
        prevInterpolatedStyles.map((_, i) =>
          i === 0
            ? {maxHeight: spring(100)}
            : {maxHeight: spring(prevInterpolatedStyles[i - 1].maxHeight)}
        )
      }>
      {interpolatingStyles =>
        <div className="predictions">
          {interpolatingStyles.map((style, i) => {
            const prediction = contents[i];
            if (prediction == null) {
              return null;
            }
            const probability = prediction.probability;
            const percent = Math.round(probability * 100);
            const blackLevel = 22 - Math.max(Math.sqrt(probability * 150), 0);
            const whiteLevel = 100 - blackLevel * 1.6;
            const labels = prediction.label.split(/,\s*/);
            return (<div 
              className='prediction'
              key={`prediction-${i}`}
              style={Object.assign(style, {
                color: `rgb(${whiteLevel}%,${whiteLevel}%,${whiteLevel}%)`,
                backgroundColor: `rgb(${blackLevel}%,${blackLevel}%,${blackLevel}%)`
              })}>
              <h2>{labels[0]} <span className="probability" title="Probability">{percent}%</span></h2>
              {labels[1] != null
                ? <p className="alt-labels">{labels.slice(1, labels.length).join(', ')}</p>
                : null}
              
            </div>);
          })}
        </div>
      }
    </StaggeredMotion>);
  }
}

export default Predictions;