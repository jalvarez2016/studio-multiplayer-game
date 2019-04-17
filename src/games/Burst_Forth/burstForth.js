import GameComponent from "../../GameComponent.js";
import React from "react";
import UserApi from "../../UserApi.js";
import firebase from "firebase";
//

const W = 900;
const H = 700;
const R = 20;
const fps = 100;
const paddleWidth = 100,
  paddleHeight = 10,
  paddleY = H - 100;
var windowWidth = document.body.clientWidth;
var derp = (windowWidth - W) / 2;

export default class burst_Forth extends GameComponent {
  constructor(props) {
    super(props);
    this.user = firebase.auth().currentUser.uid;
    this.session = firebase
      .database()
      .ref(`/session/${props.location.state.id}`);
    this.isCreator = this.user === props.location.state.creator;

    this.interval = setInterval(() => this.ballMove(), 1000 / fps);
    this.state = {
      ball: {
        left: 1,
        top: 1,
        ballR: 10,
        ballSpeedX: 5,
        ballSpeedY: 5
      },
      youLeft: 0
    };
  }

  ballMove() {
    var { left, top, ballR, ballSpeedX, ballSpeedY } = this.state.ball;

    if (left + ballR > W || ballR + left < 0) {
      ballSpeedX = -ballSpeedX;
    }
    if (top + ballR > H || ballR + top < 0) {
      ballSpeedY = -ballSpeedY;
    }

    if (
      this.state.youLeft - derp - paddleWidth / 2 < left &&
      this.state.youLeft - derp + paddleWidth / 2 > left + ballR
    ) {
      if (top >= paddleY && top + ballR / 2 <= paddleY + paddleHeight) {
        ballSpeedY = -ballSpeedY;
      }
    }

    this.setState({
      ball: {
        left: left + ballSpeedX,
        top: top + ballSpeedY,
        ballR: ballR,
        ballSpeedX: ballSpeedX,
        ballSpeedY: ballSpeedY
      }
    });
  }

  onMouseMove(e) {
    this.getSessionDatabaseRef().set({
      x_cord: e.clientX
    });
  }

  onSessionDataChanged(data) {
    this.setState({
      youLeft: data.x_cord
    });
  }

  render() {
    windowWidth = document.body.clientWidth;
    derp = (windowWidth - W) / 2;

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
