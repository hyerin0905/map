import './App.css';
import * as React from 'react'
import { Reset } from 'styled-reset'
import WriteMapPage from './newMap/WriteMapPage';


function App() {

  const setAddress = e => console.log(e);

  return (
    <>
      <Reset />
      <WriteMapPage setAddress={setAddress} />
    </>
  );
}
export default App;
