import GameComponent from "../../GameComponent.js";
import React from "react";
import UserApi from "../../UserApi.js";
import firebase from "firebase";
//

const W = 900;
const H = 700;
const fps = 100;
const paddleWidth = 100,
  paddleHeight = 10,
  paddleY = H - 100;
var windowWidth = document.body.clientWidth;
var derp = (windowWidth - W) / 2;

var durability = {
  0: "black",
  1: "red",
  2: "yellow",
  3: "blue"
};

class block {
  constructor(top, left, width, height, durabilityNum) {
    this.width = width;
    this.height = height;
    this.top = top;
    this.left = left;
    this.durabilityNum = durabilityNum;
    this.color = durability[durabilityNum];
  }
}

var block1 = new block(10, 10, H / 10, 20, 3);
var block2 = new block(120, 10, H / 10, 20, 2);
var block3 = new block(230, 10, H / 10, 20, 1);
var blocks = [block1, block2, block3];

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
        left: W / 2,
        top: paddleY - 50,
        ballR: 10,
        ballSpeedX: 5,
        ballSpeedY: 5
      },
      youLeft: 0,
      youScore: 0
    };
  }

  ballMove() {
    var { left, top, ballR, ballSpeedX, ballSpeedY } = this.state.ball;

    //wall collisions
    if (left + ballR > W || ballR + left < 0) {
      ballSpeedX = -ballSpeedX;
    }
    if (top + ballR > H || ballR + top < 0) {
      ballSpeedY = -ballSpeedY;
    }

    //paddle collisions
    if (
      this.state.youLeft - derp - paddleWidth / 2 < left &&
      this.state.youLeft - derp + paddleWidth / 2 > left + ballR
    ) {
      if (top >= paddleY && top + ballR / 2 <= paddleY + paddleHeight) {
        ballSpeedY = -ballSpeedY;
        var delta = left - (this.state.youLeft - derp + paddleHeight / 2);
        ballSpeedX = delta * 0.25;
      }
    }

    //block collsions

    for (var i = 0; i < blocks.length; i++) {
      if (
        left + ballR <= blocks[i].left + blocks[i].width &&
        left >= blocks[i].left
      ) {
        if (
          top + ballR <= blocks[i].top + blocks[i].height &&
          top >= blocks[i].top
        ) {
          ballSpeedY = -ballSpeedY;
          var currentBlock = blocks[i];
          currentBlock.durabilityNum -= 1;
          console.log(currentBlock.durabilityNum);
          this.checkBlock(currentBlock);
        }
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
  checkBlock(currentBlock) {
    currentBlock.color = durability[currentBlock.durabilityNum];

    if (currentBlock.durabilityNum <= 0) {
      currentBlock.height = 0;
      currentBlock.width = 0;
    }
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
    // var id = this.getSessionId();
    // var users = this.getSessionUserIds().map(user_id => (
    //   <li key={user_id}>{user_id}</li>
    // ));
    // var creator = this.getSessionCreatorUserId();

    return (
      <div>
        {/* <div
          style={{
            position: "absolute",
            width: "50%"
          }}
        >
          <p>Session ID: {id}</p>
          <p>Session creator: {creator}</p>
          <p>Session users:</p>
          <ul>{users}</ul>
        </div> */}
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
          <div
            style={{
              position: "absolute",
              backgroundColor: block1.color,
              width: block1.width + "px",
              height: block1.height + "px",
              top: block1.top + "px",
              left: block1.left + "px"
            }}
          />
          <div
            style={{
              position: "absolute",
              backgroundColor: block2.color,
              width: block2.width + "px",
              height: block2.height + "px",
              top: block2.top + "px",
              left: block2.left + "px"
            }}
          />
          <div
            style={{
              position: "absolute",
              backgroundColor: block3.color,
              width: block3.width + "px",
              height: block3.height + "px",
              top: block3.top + "px",
              left: block3.left + "px"
            }}
          />
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
        <div
          style={{
            position: "absolute",
            color: "black"
          }}
        >
          <p>You have {this.state.youScore} points</p>
        </div>
      </div>
    );
  }
}
