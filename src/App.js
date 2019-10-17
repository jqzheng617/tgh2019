import React, { Component } from 'react';
import VRViz from "vr-viz";
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import DataOne from './DataOne'
import DataTwo from './DataTwo'
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
    remoteDB: new PouchDB('https://jfdsgkjhdfsuojtdjddgfldf711-blfduemix:lklkjfdg78fd87dfvnvnkjcuvdfdfvkj,nfkjsad4dd@jfdsgkjhdfsuojtdjddgfldf711-blfduemix.cloudant.com/tgh2019b'),
    localDB: new PouchDB('tgh2019b'),
    blocks: [],
    toggle: true
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

  switchDataTen = () => {
    this.setState({
      toggle: true
    })
  }

  switchDataTwenty = () => {
    this.setState({
      toggle: false
    })
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
          <Button onClick={() => this.switchDataTen()}>Today</Button>
          <Button onClick={() => this.switchDataTwenty()}>This Week</Button>
        </BtnDiv>
    </Section1>
    <Section2>
      {this.state.toggle ? <DataOne /> : <DataTwo />}
    </Section2>
     </Container>
    );
  }
}

export default App;
