import React from 'react';
import './css/AutoComplete.css';

class AutoComplete extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      options: [],
      value:''
    };
  }

  onTextChange = (e) => {
    const {data} = this.props
    const value = e.target.value;
    let options = [];
    if(value.length > 0){
      const regex = new RegExp(`^${value}`, 'i')
      options = data.sort().filter(item => regex.test(item))
    }
    this.setState({options, value})
  }

  optionSelected(value){
    this.setState({
      value,
      options: []
    })
  }

  renderOptions () {
    const { options } = this.state;
    if (options.length === 0){
      return null;
    }
    return (
      <ul>
        {options.map((item) => <li onClick = {() => this.optionSelected(item)}> {item} </li>)}
      </ul>
    )
  }

  render () {
    const {title} = this.props;
    const {value} = this.state;
    return (
      <div className = 'AutoComplete'>
        <input
          placeholder = {title}
          value = {value}
          onChange = {this.onTextChange}
          type = 'text'/>
        { this.renderOptions() }
      </div>
    )
  }
}

export default AutoComplete