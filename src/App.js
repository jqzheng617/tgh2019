import React, { Component } from 'react';
import VRViz from "vr-viz";
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind)


class App extends Component {

  state ={
    remoteDB: new PouchDB('https://2aeca32c-420b-42c5-96ef-8032e3b74711-bluemix:c4401364a26441bb9839a382f32c5965b6dd1969afd80b1cf0a4d2a704eb94dd@2aeca32c-420b-42c5-96ef-8032e3b74711-bluemix.cloudant.com/tgh2019b'),
    localDB: new PouchDB('tgh2019b'),
    blocks: []
  }

  componentDidMount = () => {
    if (this.state.remoteDB) {
      this.syncToRemote();
      // this.getBlocks();
<<<<<<< HEAD
=======
      this.filter()
>>>>>>> c1ca1c0c4f0aac97538f059b25dac32fbc856d64
    }
  }

  getPouchDocs = (change) => {
    console.log(this.state.localDB, change.change.docs,  'this is get pouch')
    this.setState({
      blocks: [this.filter()]
    })
  }

  syncToRemote = () => {
    this.state.localDB.sync(this.state.remoteDB, {live: true, retry: true})
    .on('change', change => {
      console.log('---------------')
      this.getPouchDocs(change);
    })
    .on('error', err => console.log('uh oh! an error occured while synching.'));
    console.log(this.state.localDB, 'this is remoteDB sync ')
  }
  
  filter = () => {
    this.state.remoteDB.allDocs({
      include_docs: true,
      attachments: true
     }).then((result) => this.setState({ blocks: [...result.rows]}) 
     ).then((result) =>  result.rows) 
      .catch(function (err) {
      console.log(err);
     });
  }

  render() {
    console.log(this.state.blocks, 'this is blocks componentdidmount')
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
              'position': '10 2 15',
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
