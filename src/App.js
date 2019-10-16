import React, { Component } from 'react';
import VRViz from "vr-viz";
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';


class App extends Component {

  state ={
    remoteDB: new PouchDB(`${process.env.REACT_CLOUDANT_API}`),
    localDB: new PouchDB('data'),
    blocks: []
  }

  componentDidMount = () => {
    if (this.state.remoteDB) {
      this.syncToRemote();
      // this.getBlocks();
    }
    console.log(this.state.localDB.allDocs, 'this is remoteDB')
  }

  getPouchDocs = (change) => {

    console.log(this.state.localDB, change.change.docs,  'this is get pouch')
    this.setState({
      blocks: [...change.change.docs]
    })
  }

  // getBlocks = () => {
  //   this.state.localDB.sync(this.state.remoteDB, {live: true, retry: true})
  // }

  syncToRemote = () => {
    this.state.localDB.sync(this.state.remoteDB, {live: true, retry: true})
    .on('change', change => {
      console.log('---------------')
      this.getPouchDocs(change);
    })
    .on('error', err => console.log('uh oh! an error occured while synching.'));
    console.log(this.state.localDB, 'this is remoteDB sync ')
  }


  render() {
    return (
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
                'decay': 1,
              },
              {
                'type': 'ambient',
                'color': '#fff',
                'intensity': 1,
                'decay': 1,
              }
            ],
            'camera': {
              'position': '10 0 20',
              'rotation': '0 0 0',
            },
          }
        }
        graph={
          [
            {
              'type': 'BarGraph',
              'data': {
                'dataFile': 'data.json',
                'fileType': 'json',
              },
              'style': {
                'origin': [0, 0, 0],
                'dimensions': {
                  'width': 20,
                  'height': 5,
                  'depth': 10,
                },
              },
              'mark': {
                'type': 'box',
                'position': {
                  'x': {
                    'scaleType': 'ordinal',
                    'field': 'x',
                  },
                  'z': {
                    'scaleType': 'ordinal',
                    'field': 'z',
                  }
                },
                'style': {
                  'padding': {
                    'x': 0.1,
                    'z': 0.1,
                  },
                  'height': {
                    'scaleType': 'linear',
                    'startFromZero': true,
                    'field': 'height',
                  },
                  'fill': {
                    'opacity': 0.8,
                    'scaleType': 'linear',
                    'field': 'height',
                    'color': ['green', 'yellow'],
                  },
                },
              },
              'axis': {
                'x-axis': {
                  'orient': 'back-bottom',
                  'title': {
                    'value': '',
                    'fontSize': 3,
                    'color': 'white',
                    'opacity': 0.7,
                  },
                  'ticks': {
                    'noOfTicks': 10,
                    'size': 0.01,
                    'color': 'white',
                    'opacity': 0.7,
                    'fontSize': 3,
                  },
                  'grid': {
                    'color': 'white',
                    'opacity': 0.7,
                  }
                },
                'y-axis': {
                  'orient': 'back-left',
                  'title': {
                    'value': '',
                    'fontSize': 3,
                    'color': 'white',
                    'opacity': 0.7,
                  },
                  'ticks': {
                    'noOfTicks': 10,
                    'size': 0.01,
                    'color': 'white',
                    'opacity': 0.7,
                    'fontSize': 3,
                  },
                  'grid': {
                    'color': 'white',
                    'opacity': 0.7,
                  }
                },
                'z-axis': {
                  'orient': 'bottom-left',
                  'title': {
                    'value': '',
                    'fontSize': 3,
                    'color': 'white',
                    'opacity': 0.7,
                  },
                  'ticks': {
                    'noOfTicks': 10,
                    'size': 0.01,
                    'color': 'white',
                    'opacity': 0.7,
                    'fontSize': 3,
                  },
                  'grid': {
                    'color': 'white',
                    'opacity': 0.7,
                  }
                }
              }
            }
          ]
        }
    />
    );
  }
}

export default App;
