import React from 'react'
import axios from 'axios'
import Autocomplete from './Autocomplete.jsx'


class App extends React.Component {
  constructor(){
    super();
    this.state = {
      options:[]
    }
  }

  componentDidMount(){
    this.fetchOptions()
  }

  fetchOptions(){
    let result = [];
    axios({
      method: 'get',
      url: '/api/options',
    })
      .then((response) => {
        for (let i = 0; i < response.data.length; i++){
          let obj = response.data[i];
          result.push(obj.type)
        }
        this.setState({
          options: result
        });
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  render (){
    return (
      <>
      <Autocomplete options = {this.state.options} />
      </>
    )
  }
}

export default App