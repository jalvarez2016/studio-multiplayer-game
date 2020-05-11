import React from "react";

export default class Enemy extends React.Component {
  constructor(props) {
    super(props);
    var defaultValue = {};
    this.state = defaultValue;
  }

  render() {
    let enemyStyle = {
      width: "20px",
      height: "20px",
      backgroundColor: "red",
      position: "relative",
      top: this.props.pos.top + "px",
      left: this.props.pos.left + "px"
    };

    return <div className="enemy" style={enemyStyle} />;
  }
}
