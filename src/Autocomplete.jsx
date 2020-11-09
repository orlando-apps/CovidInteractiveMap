import React from 'react'

class Autocomplete extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: '',
      filter: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  handleChange (e){
    let {options} = this.props;
    let input = e. target.value;
    let filtered;
    if(input === ""){
     filtered = [];
    } else {
     filtered = options.filter((item) =>  item.toLowerCase()[0] === input.toLowerCase()[0] && item.toLowerCase().indexOf(input.toLowerCase()) !== -1)
    }
    this.setState({
      value: input,
      filter: filtered,
    });
  }

  onClick(e){
    this.setState({
      value: e.currentTarget.innerText,
      filter: []
    });
  }

  render (){
    let options = this.state.filter.map((optionName, index) => {
      return (
        <li key={optionName} onClick={this.onClick}> {optionName} </li>
      );
    })

    return (
      <div>
      <form>
        <label>
          Name:
          <br></br>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
      </form>
      {options}
      </div>
    )
  }
}

export default Autocomplete;