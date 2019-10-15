import React from 'react';
import logo from './logo.svg';
import './App.css';
import VRViz from "vr-viz"

function App() {
  return (
    <div className="App">
    <VRViz
    scene={
      {
        'sky': {
          'style': {
            'color': '#333',
            'texture': false,
          }
        },
        'lights': [
          {
            'type': 'directional',
            'color': '#fff',
            'position': '0 1 1',
            'intensity': 1,
            "decay": 1,
          },
          {
            'type': 'ambient',
            'color': '#fff',
            'intensity': 1,
            "decay": 1,
          }
        ],
        'camera': {
          'position': '10.5 5.5 11',
          'rotation': '0 0 0',
        },
      }
    }
    graph={
      [
        {
          'type': 'SurfacePlot',
          'style': {
            'origin': [0, 6, 0],
            'dimensions': {
              'width': 10,
              'height': 5,
              'depth': 10,
            },
          },
          'mark': {
            'type': 'plane',
            'position': {
              'x': {
                'scaleType': 'linear',
                'domain': [0, 2 * Math.PI],
                'steps': 50,
              },
              'y': {
                'scaleType': 'linear',
                'function': (x, z) => x * Math.sin(x) - z * Math.cos(z),
              },
              'z': {
                'scaleType': 'linear',
                'domain': [0, 2 * Math.PI],
                'steps': 50,
              }
            },
            'style': {
              'fill': {
                'scaleType': 'linear',
                'function': (x, z) => x * z,
                'color': ['#DB4437', '#0f9d58'],
                'opacity': 1,
              },
            }
          },
          'axis': {
            'axis-box': {
              'color': 'black',
            },
            'x-axis': {
              'orient': 'bottom-back',
              'title': {
                'text': '',
                'fontSize': 10,
                'color': 'black',
                'opacity': 1,
              },
              'ticks': {
                'noOfTicks': 10,
                'size': 0.1,
                'color': 'black',
                'opacity': 1,
                'fontSize': 10,
              },
              'grid': {
                'color': 'black',
                'opacity': 1,
              }
            },
            'y-axis': {
              'orient': 'bottom-back',
              'title': {
                'text': '',
                'fontSize': 10,
                'color': 'black',
                'opacity': 1,
              },
              'ticks': {
                'noOfTicks': 10,
                'size': 0.1,
                'color': 'black',
                'opacity': 1,
                'fontSize': 10,
              },
              'grid': {
                'color': 'black',
                'opacity': 1,
              }
            },
            'z-axis': {
              'orient': 'bottom-back',
              'title': {
                'text': '',
                'fontSize': 10,
                'color': 'black',
                'opacity': 1,
              },
              'ticks': {
                'noOfTicks': 10,
                'size': 0.1,
                'color': 'black',
                'opacity': 1,
                'fontSize': 10,
              },
              'grid': {
                'color': 'black',
                'opacity': 1,
              }
            }
          }
        }
      ]
    }
  />
    </div>
  );
}

export default App;
