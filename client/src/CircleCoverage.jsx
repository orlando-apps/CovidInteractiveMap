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

  handleSubmit = (event) => {
    event.preventDefault();
    // this.props.handleRadiusUpdate(+this.state.radius)
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Set Radius:
            <input type="text" value={this.state.radius} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Update" />
        </form>
      </div>
    );
  }
}

export default CircleCoverage