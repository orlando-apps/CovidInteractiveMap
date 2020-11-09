import React from 'react'
import classNames from 'classnames'

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
    const btnClass1 = classNames('action_btn', 'ui green button')
    const btnClass2 = classNames('action_btn', 'ui red button')

    return (
      <div>
          <label>Location: </label>
          <br></br>
          <h3>{info.location}</h3>
          <br></br>
          <label>Covid Case Counts:</label>
            <input type="text" value={this.state.value} onChange={this.handleUpdateChange} />
        <div className = 'btn_margin_top'>
          <button className = {btnClass1} onClick={this.handleUpdateSubmit}>Update</button>
          <button className = {btnClass2} onClick={this.handleDeleteClick}>Delete</button>
        </div>
      </div>
    );
  }
}

export default CovidCircleUpdate

{/* <form onSubmit={this.handleUpdateSubmit}>
<label>Location: {info.location}</label>
<label>Covid Case Counts:</label>
<label>
  <input type="text" value={this.state.value} onChange={this.handleUpdateChange} />
</label>
<input type="submit" value="update" />
</form> */}