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
    remoteDB: new PouchDB('https://2aeca32c-420b-4fdsc5-96ef-80efdwfdefwefawefaew32e3b74711-blfduemix:c440df1364a26441bb9839a382dff32c5965dfdfb6dd1969afd80b1cf0a4d2a7df04eb9ergfadsad4dd@2aeca32c-420b-42c5-96ef-8032e3b74711-bluemix.cloudant.com/tgh2019b'),
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
          <Button onClick={() => this.switchDataTen()}>Last 10 Transactions</Button>
          <Button onClick={() => this.switchDataTwenty()}>Last 25 Transactions</Button>
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
