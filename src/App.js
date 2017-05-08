/*
Jade Forsberg HW 5 simplepedia to server
  Used code examples from Professor Andrews
  App.js

  App - top-level component of application, responsible for managing the data collection.

  It displays the title of the application. ContentArea component handles most functionality.
  */

import React, { Component } from 'react';
import styled from 'styled-components';

import ContentArea from './components/ContentArea.js';


const CenteredTitle=styled.h1`
  text-align: center;
`;

class App extends Component {
  render() {

    return (
      <div className="App">
        <CenteredTitle>Simplepedia</CenteredTitle>
        <ContentArea />
      </div>
    );
  }
}

export default App;
