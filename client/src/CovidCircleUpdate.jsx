import React from 'react'

class CovidCircleUpdate extends React.Component {
  constructor(props) {
    super(props);
    const {info} = this.props
    this.state = {
      value: info.cases
    };
  }

  componentDidUpdate(prevProps){
    if(prevProps.info.cases !== this.props.info.cases){
        this.setState({
            value: this.props.info.cases
        });
    }
  }

  handleUpdateSubmit = (event) => {
    event.preventDefault();
    const {handleUpdateClick, info} = this.props
    const {value} = this.state
    handleUpdateClick(value)
    alert(`Updated case count for ${info.location}`);
  }

  handleUpdateChange = (e) => {
    this.setState({value: event.target.value});
  }

  handleDeleteClick = (e) =>{
    const {handleDeleteClick, info} = this.props
    handleDeleteClick()
    alert(`Delete cases for ${info.location}`);
  }

  render() {
    const {info} = this.props
    console.log(this.props)
    return (
      <div>
        <form onSubmit={this.handleUpdateSubmit}>
          <label>Location: {info.location}</label>
          <label>Covid Case Counts:</label>
          <label>
            <input type="text" value={this.state.value} onChange={this.handleUpdateChange} />
          </label>
          <input type="submit" value="update" />
        </form>
        <button onClick={this.handleDeleteClick}>Delete</button>
      </div>
    );
  }
}

export default CovidCircleUpdate