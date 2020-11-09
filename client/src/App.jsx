import React from 'react';
import './css/App.css';
import Map from './Map.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Map />
      </div>
    );
  }
}

export default App