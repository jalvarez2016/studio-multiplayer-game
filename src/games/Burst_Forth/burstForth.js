import GameComponent from "../../GameComponent.js";
import React from "react";
import UserApi from "../../UserApi.js";
import firebase from "firebase";
//

const W = document.body.clientWidth - 200;
const H = 700;
const fps = 100;
const paddleWidth = 100,
  paddleHeight = 10,
  paddleY = H - 100;

var windowWidth = document.body.clientWidth;
var derp = (windowWidth - W) / 2;

var line = W / 2 - 5;
var lineW = 10;

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
    this.save = function() {
      return {
        width: this.width,
        height: this.height,
        top: this.top,
        left: this.left,
        durability: this.durabilityNum
      };
    };
  }
}

var block1 = new block(10, 10, H / 10, 20, 3);
var block2 = new block(120, 10, H / 10, 20, 2);
var block3 = new block(230, 10, H / 10, 20, 1);
var blocks = [block1, block2, block3];

var eBlock1 = new block(10, line + lineW + 10, H / 10, 20, 3);
var eBlock2 = new block(120, line + lineW + 10, H / 10, 20, 3);
var eBlock3 = new block(230, line + lineW + 10, H / 10, 20, 1);
var blocks2 = [eBlock1, eBlock2, eBlock3];

export default class burst_Forth extends GameComponent {
  constructor(props) {
    super(props);
    this.user = firebase.auth().currentUser.uid;
    this.session = firebase
      .database()
      .ref(`/session/${props.location.state.id}`);
    this.isCreator = this.user === props.location.state.creator;
    this.users = this.getSessionUserIds().map(user_id =>
      UserApi.getName(user_id)
    );
    this.creator = UserApi.getName(this.getSessionCreatorUserId());
    this.interval = setInterval(() => this.ballMove(), 1000 / fps);
    this.state = {
      ball: {
        left: W / 4,
        top: paddleY - 50,
        ballR: 10,
        ballSpeedX: 4,
        ballSpeedY: 3
      },
      ball2: {
        //use this later for the collsion of the other player
        left2: (3 * W) / 4,
        top2: paddleY - 50,
        ballR2: 10,
        ballSpeedX2: 4,
        ballSpeedY2: 3
      },
      you: {
        left: W / 2
      },
      p2: {
        left: (3 * W) / 4
      },
      youScore: 0
    };
    this.getSessionDatabaseRef().set({
      ball: this.state.ball,
      ball2: this.state.ball2,
      P1: {
        name: this.users[0],
        x_cord: this.state.you.left,
        score: 0, //change to the state score later
        blocks: [block1.save(), block2.save(), block3.save()]
      },
      P2: {
        name: this.users[1],
        x_cord: this.state.p2.left,
        score: 0 //change to the state score later
      }
    });
  }

  ballMove() {
    if (this.isCreator) {
      var { left, top, ballR, ballSpeedX, ballSpeedY } = this.state.ball;

      //wall collisions
      if (left + ballR > W || ballR + left < 0) {
        ballSpeedX = -ballSpeedX;
      }
      if (top + ballR > H || top < 0) {
        ballSpeedY = -ballSpeedY;
      }

      //middle collision
      if (left + ballR > line) {
        ballSpeedX = -ballSpeedX;
      }

      //paddle collisions
      if (
        this.state.you.left - derp - paddleWidth / 2 < left &&
        this.state.you.left - derp + paddleWidth / 2 > left + ballR
      ) {
        if (top >= paddleY && top + ballR / 2 <= paddleY + paddleHeight) {
          ballSpeedY = -ballSpeedY;
          // var delta = left - (this.state.you.left - derp + paddleHeight / 2);
          // ballSpeedX = delta * 0.25;
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

      this.getSessionDatabaseRef().update({
        ball: {
          left: left + ballSpeedX,
          top: top + ballSpeedY,
          ballR: ballR,
          ballSpeedX: ballSpeedX,
          ballSpeedY: ballSpeedY
        }
      });
    }

    if (!this.isCreator) {
      //ball 2 collisions

      var { left2, top2, ballR2, ballSpeedX2, ballSpeedY2 } = this.state.ball2;

      //wall collisions
      if (left2 + ballR2 > W || ballR2 + left2 < line + lineW) {
        ballSpeedX2 = -ballSpeedX2;
      }
      if (top2 + ballR2 > H || top2 < 0) {
        ballSpeedY2 = -ballSpeedY2;
      }

      //middle collision
      if (left2 - ballR2 < line + lineW) {
        ballSpeedX2 = -ballSpeedX2;
      }

      //paddle collisions
      if (
        this.state.p2.left - derp - paddleWidth / 2 < left2 &&
        this.state.p2.left - derp + paddleWidth / 2 > left2 + ballR2
      ) {
        if (top2 >= paddleY && top2 + ballR2 / 2 <= paddleY + paddleHeight) {
          ballSpeedY2 = -ballSpeedY2;
          // var delta = left - (this.state.you.left - derp + paddleHeight / 2);
          // ballSpeedX = delta * 0.25;
        }
      }

      //block collsions

      for (var x = 0; x < blocks2.length; x++) {
        if (
          left + ballR <= blocks2[x].left + blocks2[x].width &&
          left >= blocks2[x].left
        ) {
          if (
            top + ballR <= blocks2[x].top + blocks2[x].height &&
            top >= blocks2[x].top
          ) {
            ballSpeedY2 = -ballSpeedY2;
            var currentBlock2 = blocks2[x];
            currentBlock2.durabilityNum -= 1;
            console.log(currentBlock.durabilityNum);
            this.checkBlock(currentBlock2);
          }
        }
      }
      this.getSessionDatabaseRef().update({
        ball2: {
          left2: left2 + ballSpeedX2,
          top2: top2 + ballSpeedY2,
          ballR2: ballR2,
          ballSpeedX2: ballSpeedX2,
          ballSpeedY2: ballSpeedY2
        }
      });
    }
  }

  checkBlock(currentBlock) {
    if (this.isCreator) {
      console.log("creator");
      //push the blocks changes into firebase
    }
    currentBlock.color = durability[currentBlock.durabilityNum];

    if (currentBlock.durabilityNum <= 0) {
      currentBlock.height = 0;
      currentBlock.width = 0;
    }
  }

  onMouseMove(e) {
    //if this is session creator
    if (this.isCreator && e.clientX < line + lineW + 50 && e.clientX > 150) {
      this.getSessionDatabaseRef().update({
        P1: {
          name: this.users[0],
          x_cord: e.clientX,
          score: 0 //change to the state score later
        }
      });
    }
    if (
      UserApi.getName(this.user) === this.users[1] &&
      e.clientX > line + lineW + 150 &&
      e.clientX < windowWidth - 150
    ) {
      this.getSessionDatabaseRef().update({
        P2: {
          name: this.users[1], //change name
          x_cord: e.clientX,
          score: 0 //change to the state score later
        }
      });
    }
  }

  onSessionDataChanged(data) {
    console.log(data);
    this.setState({
      ball: {
        left: data.ball.left,
        top: data.ball.top,
        ballR: data.ball.ballR,
        ballSpeedX: data.ball.ballSpeedX,
        ballSpeedY: data.ball.ballSpeedY
      },
      ball2: {
        //use this later for the collsion of the other player
        left2: data.ball2.left2,
        top2: data.ball2.top2,
        ballR2: data.ball2.ballR2,
        ballSpeedX2: data.ball2.ballSpeedX2,
        ballSpeedY2: data.ball2.ballSpeedY2
      },
      you: {
        left: data.P1.x_cord
      },
      p2: {
        left: data.P2.x_cord
      }
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
              backgroundColor: "green",
              width: paddleWidth + "px",
              height: paddleHeight + "px",
              top: paddleY + "px",
              left: this.state.you.left - derp - paddleWidth / 2 + "px"
            }}
          />
          <div
            className="ball1"
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

          <div
            className="line"
            style={{
              position: "absolute",
              backgroundColor: "white",
              width: lineW + "px",
              height: "inherit",
              left: line + "px"
            }}
          />

          <div
            className="Player2"
            style={{
              position: "absolute",
              backgroundColor: "purple",
              width: paddleWidth + "px",
              height: paddleHeight + "px",
              top: paddleY + "px",
              left: this.state.p2.left - derp - paddleWidth / 2 + "px"
            }}
          />
          <div
            className="ball2"
            style={{
              position: "absolute",
              backgroundColor: "white",
              width: this.state.ball2.ballR2 + "px",
              height: this.state.ball2.ballR2 + "px",
              borderRadius: "50%",
              top: this.state.ball2.top2 + "px",
              left: this.state.ball2.left2 + "px"
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
