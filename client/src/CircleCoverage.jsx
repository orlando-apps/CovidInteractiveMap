import React from 'react'

class CircleCoverage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radius: this.props.radius
    };
  }

  handleChange = (event) => {
    this.setState({radius: event.target.value});
    this.props.handleRadiusUpdate(+event.target.value)
  }

  render() {
    return (
      <div className = "innerContainer">
        <div>
          <label>Number of Cases</label>
          <input type="number" value={this.state.radius} onChange={this.handleChange} />
        </div>
      </div>
    );
  }
}

export default CircleCoverage