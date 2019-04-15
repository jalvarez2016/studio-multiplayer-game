import GameComponent from "../../GameComponent.js";
import React from "react";
import UserApi from "../../UserApi.js";
import firebase from "firebase";
//

const W = 900;
const H = 700;
const R = 20;
const paddleWidth = 100,
  paddleHeight = 10,
  paddleY = H - 100;
var youLeft = 0;

export default class burst_Forth extends GameComponent {
  constructor(props) {
    super(props);
    this.user = firebase.auth().currentUser.uid;
    this.session = firebase
      .database()
      .ref(`/session/${props.location.state.id}`);
    this.isCreator = this.user === props.location.state.creator;

    this.state = {
      ball: {
        left: 0,
        top: 0,
        ballR: 10,
        ballSpeed: 10
      }
    };
    this.interval = setInterval(() => this.ballMove(), 10);
  }

  ballMove() {}

  onMouseMove(e) {
    console.log(e.clientX);
    this.getSessionDatabaseRef().set({
      x_cord: e.clientX
    });
  }

  onSessionDataChanged(data) {
    this.setState({
      youLeft: data.x_cord
    });
    console.log(data, youLeft);
  }

  render() {
    var windowWidth = document.body.clientWidth;
    var derp = (windowWidth - W) / 2;

    return (
      <div
        style={{
          margin: "30px auto",
          position: "relative",
          backgroundColor: "black",
          width: W + "px",
          height: H + "px"
          // cursor: "none"
        }}
        onMouseMove={e => this.onMouseMove(e)}
      >
        <div
          className="You"
          style={{
            position: "absolute",
            backgroundColor: "white",
            width: paddleWidth + "px",
            height: paddleHeight + "px",
            top: paddleY + "px",
            left: this.state.youLeft - derp - paddleWidth / 2 + "px"
          }}
        />

        <div
          className="Ball"
          style={{
            position: "absolute",
            backgroundColor: "white",
            width: this.state.ball.ballR + "px",
            height: this.state.ball.ballR + "px",
            borderRadius: "50%",
            top: this.state.ball.top + "px",
            left: this.state.ball.left + "px"
          }}
        />
        <div
          style={{
            position: "absolute",
            backgroundColor: "white",
            width: this.state.ball.ballR + "px",
            height: this.state.ball.ballR + "px",
            borderRadius: "50%",
            top: this.state.ball.y + "px",
            left: this.state.ball.x + "px"
          }}
        />

        {/* <div className="Enemy"
          style={{
            position: "relative",
            backgroundColor: "white",
            width: paddleWidth + "px",
            height: paddleHeight + "px"
          }}
        /> */}
      </div>
    );
  }
}
