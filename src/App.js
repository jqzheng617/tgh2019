import React, { Component } from 'react';
import VRViz from "vr-viz";
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import {
  Container,
  Section1,
  Section2,
  BtnDiv,
  Button,
  Title
} from './style.js'

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
      this.filter()
    }
  }

  getPouchDocs = (change) => {
    console.log(this.state.localDB, change.change.docs,  'this is get pouch')
    // this.setState({
    //   blocks: [this.filter()]
    // })
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
     }).then((result) => this.setState({ blocks: [result.rows]}) 
     ).then((result) =>  result.rows) 
      .catch(function (err) {
      console.log(err);
     });
  }

  render() {
    console.log(this.state.blocks, 'this is blocks render')
    const divStyle = {
      height: '100px',
    };
    return (
    <Container>
      <Section1>
        <Title>Casper Labs Plasma XR</Title>
        <BtnDiv>
          <Button>1</Button>
          <Button>2</Button>
          <Button>3</Button>
          <Button>4</Button>
          <Button>5</Button>
        </BtnDiv>
    </Section1>
      <Section2>
      <VRViz embedded style={divStyle}
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
                    'opacity': 1,
                    'scaleType': 'linear',
                    'field': 'height',
                    'color': ['red', 'gray'],
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
    </Section2>
     </Container>
    );
  }
}

export default App;
