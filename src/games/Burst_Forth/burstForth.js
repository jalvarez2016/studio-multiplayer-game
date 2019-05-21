import GameComponent from "../../GameComponent.js";
import React from "react";
import UserApi from "../../UserApi.js";
import firebase from "firebase";
//
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

var numGone = 0;
var goneBlocks = [];

var durability = {
  0: "black",
  1: "red",
  2: "yellow",
  3: "blue"
};

class block {
  constructor(top, left, width, height) {
    var ranDurability = Math.floor(Math.random() * 3) + 1;
    this.width = width;
    this.height = height;
    this.top = top;
    this.left = left;
    this.durabilityNum = ranDurability;
    this.color = durability[ranDurability];
    this.save = function() {
      return {
        width: this.width,
        height: this.height,
        top: this.top,
        left: this.left,
        durability: this.durabilityNum,
        color: this.color
      };
    };
  }
}

//back row
var block1 = new block(10, 10, W / 20, 20);
var block2 = new block(10, W / 20 + 20, W / 20, 20);
var block3 = new block(10, 2 * (W / 20) + 30, W / 20, 20);
var block4 = new block(10, 3 * (W / 20) + 40, W / 20, 20);
var block5 = new block(10, 4 * (W / 20) + 50, W / 20, 20);
var block6 = new block(10, 5 * (W / 20) + 60, W / 20, 20);
//Second last row
var block7 = new block(120, 10, W / 20, 20);
var block8 = new block(120, W / 20 + 20, W / 20, 20);
var block9 = new block(120, 2 * (W / 20) + 30, W / 20, 20);
var block10 = new block(120, 3 * (W / 20) + 40, W / 20, 20);
var block11 = new block(120, 4 * (W / 20) + 50, W / 20, 20);
var block12 = new block(120, 5 * (W / 20) + 60, W / 20, 20);
// first row
var block13 = new block(230, 10, W / 20, 20);
var block14 = new block(230, W / 20 + 20, W / 20, 20);
var block15 = new block(230, 2 * (W / 20) + 30, W / 20, 20);
var block16 = new block(230, 3 * (W / 20) + 40, W / 20, 20);
var block17 = new block(230, 4 * (W / 20) + 50, W / 20, 20);
var block18 = new block(230, 5 * (W / 20) + 60, W / 20, 20);
var blocks = [
  block1,
  block2,
  block3,
  block4,
  block5,
  block6,
  block7,
  block8,
  block9,
  block10,
  block11,
  block12,
  block13,
  block14,
  block15,
  block16,
  block17,
  block18
];

//back row
var eBlock1 = new block(10, line + lineW + 10, W / 20, 20);
var eBlock2 = new block(10, W / 20 + line + lineW + 20, W / 20, 20);
var eBlock3 = new block(10, 2 * (W / 20) + line + lineW + 30, W / 20, 20);
var eBlock4 = new block(10, 3 * (W / 20) + line + lineW + 40, W / 20, 20);
var eBlock5 = new block(10, 4 * (W / 20) + line + lineW + 50, W / 20, 20);
var eBlock6 = new block(10, 5 * (W / 20) + line + lineW + 60, W / 20, 20);

//middle row
var eBlock7 = new block(120, line + lineW + 10, W / 20, 20);
var eBlock8 = new block(120, W / 20 + line + lineW + 20, W / 20, 20);
var eBlock9 = new block(120, 2 * (W / 20) + line + lineW + 30, W / 20, 20);
var eBlock10 = new block(120, 3 * (W / 20) + line + lineW + 40, W / 20, 20);
var eBlock11 = new block(120, 4 * (W / 20) + line + lineW + 50, W / 20, 20);
var eBlock12 = new block(120, 5 * (W / 20) + line + lineW + 60, W / 20, 20);

//front row
var eBlock13 = new block(230, line + lineW + 10, W / 20, 20, 1);
var eBlock14 = new block(230, W / 20 + line + lineW + 20, W / 20, 20, 1);
var eBlock15 = new block(230, 2 * (W / 20) + line + lineW + 30, W / 20, 20, 1);
var eBlock16 = new block(230, 3 * (W / 20) + line + lineW + 40, W / 20, 20, 1);
var eBlock17 = new block(230, 4 * (W / 20) + line + lineW + 50, W / 20, 20, 1);
var eBlock18 = new block(230, 5 * (W / 20) + line + lineW + 60, W / 20, 20, 1);
var blocks2 = [
  eBlock1,
  eBlock2,
  eBlock3,
  eBlock4,
  eBlock5,
  eBlock6,
  eBlock7,
  eBlock8,
  eBlock9,
  eBlock10,
  eBlock11,
  eBlock12,
  eBlock13,
  eBlock14,
  eBlock15,
  eBlock16,
  eBlock17,
  eBlock18
];

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
        ballSpeedX: -4,
        ballSpeedY: -3
      },
      ball2: {
        //use this later for the collsion of the other player
        left2: (3 * W) / 4,
        top2: paddleY - 50,
        ballR2: 10,
        ballSpeedX2: -4,
        ballSpeedY2: -3
      },
      you: {
        score: 0,
        left: W / 2,
        blocks: [
          block1.save(),
          block2.save(),
          block3.save(),
          block4.save(),
          block5.save(),
          block6.save(),
          block7.save(),
          block8.save(),
          block9.save(),
          block10.save(),
          block11.save(),
          block12.save(),
          block13.save(),
          block14.save(),
          block15.save(),
          block16.save(),
          block17.save(),
          block18.save()
        ]
      },
      p2: {
        left: (3 * W) / 4,
        score: 0,
        blocks: [
          eBlock1.save(),
          eBlock2.save(),
          eBlock3.save(),
          eBlock4.save(),
          eBlock5.save(),
          eBlock6.save(),
          eBlock7.save(),
          eBlock8.save(),
          eBlock9.save(),
          eBlock10.save(),
          eBlock11.save(),
          eBlock12.save(),
          eBlock13.save(),
          eBlock14.save(),
          eBlock15.save(),
          eBlock16.save(),
          eBlock17.save(),
          eBlock18.save()
        ],
        win: false
      }
    };
    this.getSessionDatabaseRef().set({
      ball: this.state.ball,
      ball2: this.state.ball2,
      P1: {
        name: this.users[0],
        x_cord: this.state.you.left,
        score: this.state.you.score,
        blocks: [
          block1.save(),
          block2.save(),
          block3.save(),
          block4.save(),
          block5.save(),
          block6.save(),
          block7.save(),
          block8.save(),
          block9.save(),
          block10.save(),
          block11.save(),
          block12.save(),
          block13.save(),
          block14.save(),
          block15.save(),
          block16.save(),
          block17.save(),
          block18.save()
        ],
        win: false
      },
      P2: {
        name: this.users[1],
        x_cord: this.state.p2.left,
        score: this.state.p2.score, //change to the state score later
        blocks: [
          eBlock1.save(),
          eBlock2.save(),
          eBlock3.save(),
          eBlock4.save(),
          eBlock5.save(),
          eBlock6.save(),
          eBlock7.save(),
          eBlock8.save(),
          eBlock9.save(),
          eBlock10.save(),
          eBlock11.save(),
          eBlock12.save(),
          eBlock13.save(),
          eBlock14.save(),
          eBlock15.save(),
          eBlock16.save(),
          eBlock17.save(),
          eBlock18.save()
        ],
        win: false
      }
    });
  }

  checkWin() {
    if (this.isCreator) {
      numGone = 0;
      for (var q = 0; q < blocks.length; q++) {
        if (blocks[q].durabilityNum === 0) {
          numGone += 1;
          goneBlocks.push(blocks[q]);
          if (numGone === blocks.length) {
            this.getSessionDatabaseRef().update({
              P1: {
                name: this.users[0],
                x_cord: this.state.you.left,
                score: numGone, //change to the state score later
                blocks: this.state.you.blocks,
                win: true
              }
            });
          }
        } else {
        }
      }
    } else {
      numGone = 0;
      for (var y = 0; y < blocks2.length; y++) {
        if (blocks2[y].durabilityNum === 0) {
          numGone += 1;
          if (numGone === blocks2.length) {
            this.getSessionDatabaseRef().update({
              P2: {
                name: this.users[1],
                x_cord: this.state.p2.left,
                score: numGone, //change to the state score later
                blocks: this.state.p2.blocks,
                win: true
              }
            });
          }
        } else {
        }
      }
    }
  }

  ballMove() {
    // fix this god damn funstion, i don't know why it doesn't work
    this.checkWin();
    if (this.isCreator) {
      var { left, top, ballR, ballSpeedX, ballSpeedY } = this.state.ball;

      //wall collisions
      if (left + ballR / 2 > W || ballR + left < 0) {
        ballSpeedX = -ballSpeedX;
      }
      if (top + ballR / 2 > H || top < 0) {
        ballSpeedY = -ballSpeedY;
      }

      //middle collision
      if (left + ballR > line) {
        ballSpeedX = -ballSpeedX;
      }

      //paddle collisions
      if (
        this.state.you.left - derp - paddleWidth / 2 < left + ballR &&
        this.state.you.left - derp + paddleWidth / 2 > left
      ) {
        if (top + ballR >= paddleY && top <= paddleY + paddleHeight) {
          ballSpeedY = -ballSpeedY;
          // var delta = left - (this.state.you.left - derp + paddleHeight / 2);
          // ballSpeedX = delta * 0.15;
        }
      }

      //block collsions

      for (var i = 0; i < blocks.length; i++) {
        var currentBlock = blocks[i];
        if (
          left + ballR >= blocks[i].left &&
          left + ballR <= blocks[i].left + 2
        ) {
          if (
            top + ballR <= blocks[i].top + blocks[i].height &&
            top + ballR >= blocks[i].top
          ) {
            ballSpeedX = -ballSpeedX;
            currentBlock.durabilityNum -= 1;
            this.checkBlock(currentBlock);
          } else if (
            top <= blocks[i].top + blocks[i].height &&
            top >= blocks[i].top
          ) {
            ballSpeedX = -ballSpeedX;
            currentBlock.durabilityNum -= 1;
            this.checkBlock(currentBlock);
          }
        } else if (
          left >= blocks[i].left + blocks[i].width - 2 &&
          left <= blocks[i].left + blocks[i].width
        ) {
          if (
            top + ballR <= blocks[i].top + blocks[i].height &&
            top + ballR >= blocks[i].top
          ) {
            ballSpeedX = -ballSpeedX;
            currentBlock.durabilityNum -= 1;
            this.checkBlock(currentBlock);
          } else if (
            top <= blocks[i].top + blocks[i].height &&
            top >= blocks[i].top
          ) {
            ballSpeedX = -ballSpeedX;
            currentBlock.durabilityNum -= 1;
            this.checkBlock(currentBlock);
          }
        } else if (
          left + ballR <= blocks[i].left + blocks[i].width &&
          left + ballR >= blocks[i].left
        ) {
          if (
            top + ballR <= blocks[i].top + 2 &&
            top + ballR >= blocks[i].top
          ) {
            ballSpeedY = -ballSpeedY;
            currentBlock.durabilityNum -= 1;
            this.checkBlock(currentBlock);
          } else if (
            top <= blocks[i].top + blocks[i].height &&
            top >= blocks[i].top + blocks[i].height - 2
          ) {
            ballSpeedY = -ballSpeedY;
            currentBlock.durabilityNum -= 1;
            this.checkBlock(currentBlock);
          }
        } else if (
          left <= blocks[i].left + blocks[i].height &&
          left >= blocks[i].width + blocks[i].left - 2
        ) {
          if (top >= blocks[i].top && top <= blocks[i].top + blocks[i].height) {
            ballSpeedX = -ballSpeedX;
            currentBlock.durabilityNum -= 1;
            this.checkBlock(currentBlock);
          } else if (
            top + ballR >= blocks[i].top &&
            top + ballR <= blocks[i].top + blocks[i].height
          ) {
            ballSpeedX = -ballSpeedX;
            currentBlock.durabilityNum -= 1;
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
    } else {
      //ball 2 collisions

      var { left2, top2, ballR2, ballSpeedX2, ballSpeedY2 } = this.state.ball2;

      //wall collisions
      if (left2 + ballR2 > W || ballR2 + left2 < line + lineW) {
        ballSpeedX2 = -ballSpeedX2;
      }
      if (top2 + ballR2 > H || top2 < 0) {
        ballSpeedY2 = -ballSpeedY2;
        if (top2 >= H) {
          //punishment for hitting the bottom
        }
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
        if (top2 + ballR2 >= paddleY && top2 <= paddleY + paddleHeight) {
          ballSpeedY2 = -ballSpeedY2;
          var delta2 = left - (this.state.p2.left - derp + paddleHeight / 2);
          ballSpeedX = delta2 * 0.25;
        }
      }
      //
      //block collsions

      for (var x = 0; x < blocks2.length; x++) {
        var currentBlock2 = blocks2[x];
        if (
          left2 + ballR2 >= blocks2[x].left &&
          left2 + ballR2 <= blocks2[x].left + 2
        ) {
          if (
            top2 + ballR2 <= blocks2[x].top + blocks2[x].height &&
            top2 + ballR2 >= blocks2[x].top
          ) {
            ballSpeedX2 = -ballSpeedX2;
            currentBlock2.durabilityNum -= 1;
            this.checkBlock(currentBlock2);
          } else if (
            top2 <= blocks2[x].top + blocks2[x].height &&
            top2 >= blocks2[x].top
          ) {
            ballSpeedX2 = -ballSpeedX2;
            currentBlock2.durabilityNum -= 1;
            this.checkBlock(currentBlock2);
          }
        } else if (
          left2 >= blocks2[x].left + blocks2[x].width - 2 &&
          left2 <= blocks2[x].left + blocks2[x].width
        ) {
          if (
            top2 + ballR2 <= blocks2[x].top + blocks2[x].height &&
            top2 + ballR2 >= blocks2[x].top
          ) {
            ballSpeedX2 = -ballSpeedX2;
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            this.checkBlock(currentBlock2);
          } else if (
            top2 <= blocks2[x].top + blocks2[x].height &&
            top2 >= blocks2[x].top
          ) {
            ballSpeedX2 = -ballSpeedX2;
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            this.checkBlock(currentBlock2);
          }
        } else if (
          left2 >= blocks2[x].left + blocks2[x].width &&
          left2 <= blocks2[x].left + blocks2[x].width + 2
        ) {
          if (
            top2 + ballR2 <= blocks2[x].top + blocks2[x].height &&
            top2 + ballR2 >= blocks2[x].top
          ) {
            ballSpeedX2 = -ballSpeedX2;
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            this.checkBlock(currentBlock2);
          } else if (
            top2 <= blocks2[x].top + blocks2[x].height &&
            top2 >= blocks2[x].top
          ) {
            ballSpeedX2 = -ballSpeedX2;
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            this.checkBlock(currentBlock2);
          }
        } else if (left2 >= blocks2[x].left && left2 <= blocks2[x].left + 2) {
          if (
            top2 + ballR2 <= blocks2[x].top + blocks2[x].height &&
            top2 + ballR2 >= blocks2[x].top
          ) {
            ballSpeedX2 = -ballSpeedX2;
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            this.checkBlock(currentBlock2);
          } else if (
            top2 <= blocks2[x].top + blocks2[x].height &&
            top2 >= blocks2[x].top
          ) {
            ballSpeedX2 = -ballSpeedX2;
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            this.checkBlock(currentBlock2);
          }
        } else if (
          left2 + ballR2 <= blocks2[x].left + blocks2[x].width &&
          left2 + ballR2 >= blocks2[x].left
        ) {
          if (
            top2 + ballR2 <= blocks2[x].top + blocks2[x].height &&
            top2 + ballR2 >= blocks2[x].top
          ) {
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            this.checkBlock(currentBlock2);
          } else if (
            top2 <= blocks2[x].top + blocks2[x].height &&
            top2 >= blocks2[x].top
          ) {
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            this.checkBlock(currentBlock2);
          }
        } else if (
          left2 <= blocks2[x].left + blocks2[x].width &&
          left2 >= blocks2[x]
        ) {
          if (
            top2 + ballR2 <= blocks2[x].top + blocks2[x].height &&
            top2 + ballR2 >= blocks2[x].top
          ) {
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            this.checkBlock(currentBlock2);
          } else if (
            top2 <= blocks2[x].top + blocks2[x].height &&
            top2 >= blocks2[x].top
          ) {
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            this.checkBlock(currentBlock);
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
    currentBlock.color = durability[currentBlock.durabilityNum];

    if (currentBlock.durabilityNum <= 0) {
      currentBlock.height = 0;
      currentBlock.width = 0;
      currentBlock.left = 0;
      currentBlock.top = 0;
    }

    if (this.isCreator) {
      this.getSessionDatabaseRef().update({
        P1: {
          name: this.users[0],
          x_cord: this.state.you.left,
          score: numGone, //change to the state score later
          blocks: [
            block1.save(),
            block2.save(),
            block3.save(),
            block4.save(),
            block5.save(),
            block6.save(),
            block7.save(),
            block8.save(),
            block9.save(),
            block10.save(),
            block11.save(),
            block12.save(),
            block13.save(),
            block14.save(),
            block15.save(),
            block16.save(),
            block17.save(),
            block18.save()
          ]
        }
      });

      //push the blocks changes into firebase
    } else {
      this.getSessionDatabaseRef().update({
        P2: {
          name: this.users[1],
          x_cord: this.state.p2.left,
          score: numGone, //change to the state score later
          blocks: [
            eBlock1.save(),
            eBlock2.save(),
            eBlock3.save(),
            eBlock4.save(),
            eBlock5.save(),
            eBlock6.save(),
            eBlock7.save(),
            eBlock8.save(),
            eBlock9.save(),
            eBlock10.save(),
            eBlock11.save(),
            eBlock12.save(),
            eBlock13.save(),
            eBlock14.save(),
            eBlock15.save(),
            eBlock16.save(),
            eBlock17.save(),
            eBlock18.save()
          ]
        }
      });
    }
  }

  onMouseMove(e) {
    //if this is session creator
    if (this.isCreator && e.clientX < line + lineW + 50 && e.clientX > 150) {
      this.getSessionDatabaseRef().update({
        P1: {
          name: this.users[0],
          x_cord: e.clientX,
          score: this.state.you.score, //change to the state score later
          blocks: [
            block1.save(),
            block2.save(),
            block3.save(),
            block4.save(),
            block5.save(),
            block6.save(),
            block7.save(),
            block8.save(),
            block9.save(),
            block10.save(),
            block11.save(),
            block12.save(),
            block13.save(),
            block14.save(),
            block15.save(),
            block16.save(),
            block17.save(),
            block18.save()
          ]
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
          score: this.state.p2.score, //change to the state score later
          blocks: [
            eBlock1.save(),
            eBlock2.save(),
            eBlock3.save(),
            eBlock4.save(),
            eBlock5.save(),
            eBlock6.save(),
            eBlock7.save(),
            eBlock8.save(),
            eBlock9.save(),
            eBlock10.save(),
            eBlock11.save(),
            eBlock12.save(),
            eBlock13.save(),
            eBlock14.save(),
            eBlock15.save(),
            eBlock16.save(),
            eBlock17.save(),
            eBlock18.save()
          ]
        }
      });
    }
  }

  onSessionDataChanged(data) {
    var winner = null;
    if (data.P1.win === true) {
      winner = "p1";
    } else if (data.P2.win === true) {
      winner = "p2";
    }
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
        score: data.P1.score,
        left: data.P1.x_cord,
        blocks: data.P1.blocks
      },
      p2: {
        score: data.P2.score,
        left: data.P2.x_cord,
        blocks: data.P2.blocks
      },
      win: winner
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

    if (this.state.win) {
      return (
        <div>
          <div>{this.state.win} is the winner</div>{" "}
          <img src="http://clipart-library.com/images/8cAEdyAXi.png" />
        </div>
      );
    } else {
      return (
        <div>
          <audio controls loop autoPlay>
            <source
              src="/Cave Story OST - Opening Theme.mp3"
              type="audio/mpeg"
            />
          </audio>
          <div
            style={{
              margin: "30px auto",
              position: "relative",
              background:
                "url('data:image/jpeg;base64,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')",
              backgroundSize: "auto",
              backgroundRepeat: "no-repeat",
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
                backgroundColor: this.state.you.blocks[0].color,
                width: this.state.you.blocks[0].width + "px",
                height: this.state.you.blocks[0].height + "px",
                top: this.state.you.blocks[0].top + "px",
                left: this.state.you.blocks[0].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[1].color,
                width: this.state.you.blocks[1].width + "px",
                height: this.state.you.blocks[1].height + "px",
                top: this.state.you.blocks[1].top + "px",
                left: this.state.you.blocks[1].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[2].color,
                width: this.state.you.blocks[2].width + "px",
                height: this.state.you.blocks[2].height + "px",
                top: this.state.you.blocks[2].top + "px",
                left: this.state.you.blocks[2].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[3].color,
                width: this.state.you.blocks[3].width + "px",
                height: this.state.you.blocks[3].height + "px",
                top: this.state.you.blocks[3].top + "px",
                left: this.state.you.blocks[3].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[4].color,
                width: this.state.you.blocks[4].width + "px",
                height: this.state.you.blocks[4].height + "px",
                top: this.state.you.blocks[4].top + "px",
                left: this.state.you.blocks[4].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[5].color,
                width: this.state.you.blocks[5].width + "px",
                height: this.state.you.blocks[5].height + "px",
                top: this.state.you.blocks[5].top + "px",
                left: this.state.you.blocks[5].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[6].color,
                width: this.state.you.blocks[6].width + "px",
                height: this.state.you.blocks[6].height + "px",
                top: this.state.you.blocks[6].top + "px",
                left: this.state.you.blocks[6].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[7].color,
                width: this.state.you.blocks[7].width + "px",
                height: this.state.you.blocks[7].height + "px",
                top: this.state.you.blocks[7].top + "px",
                left: this.state.you.blocks[7].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[8].color,
                width: this.state.you.blocks[8].width + "px",
                height: this.state.you.blocks[8].height + "px",
                top: this.state.you.blocks[8].top + "px",
                left: this.state.you.blocks[8].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[9].color,
                width: this.state.you.blocks[9].width + "px",
                height: this.state.you.blocks[9].height + "px",
                top: this.state.you.blocks[9].top + "px",
                left: this.state.you.blocks[9].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[10].color,
                width: this.state.you.blocks[10].width + "px",
                height: this.state.you.blocks[10].height + "px",
                top: this.state.you.blocks[10].top + "px",
                left: this.state.you.blocks[10].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[11].color,
                width: this.state.you.blocks[11].width + "px",
                height: this.state.you.blocks[11].height + "px",
                top: this.state.you.blocks[11].top + "px",
                left: this.state.you.blocks[11].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[12].color,
                width: this.state.you.blocks[12].width + "px",
                height: this.state.you.blocks[12].height + "px",
                top: this.state.you.blocks[12].top + "px",
                left: this.state.you.blocks[12].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[13].color,
                width: this.state.you.blocks[13].width + "px",
                height: this.state.you.blocks[13].height + "px",
                top: this.state.you.blocks[13].top + "px",
                left: this.state.you.blocks[13].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[14].color,
                width: this.state.you.blocks[14].width + "px",
                height: this.state.you.blocks[14].height + "px",
                top: this.state.you.blocks[14].top + "px",
                left: this.state.you.blocks[14].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[15].color,
                width: this.state.you.blocks[15].width + "px",
                height: this.state.you.blocks[15].height + "px",
                top: this.state.you.blocks[15].top + "px",
                left: this.state.you.blocks[15].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[16].color,
                width: this.state.you.blocks[16].width + "px",
                height: this.state.you.blocks[16].height + "px",
                top: this.state.you.blocks[16].top + "px",
                left: this.state.you.blocks[16].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.you.blocks[17].color,
                width: this.state.you.blocks[17].width + "px",
                height: this.state.you.blocks[17].height + "px",
                top: this.state.you.blocks[17].top + "px",
                left: this.state.you.blocks[17].left + "px"
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
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[0].color,
                width: this.state.p2.blocks[0].width + "px",
                height: this.state.p2.blocks[0].height + "px",
                top: this.state.p2.blocks[0].top + "px",
                left: this.state.p2.blocks[0].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[1].color,
                width: this.state.p2.blocks[1].width + "px",
                height: this.state.p2.blocks[1].height + "px",
                top: this.state.p2.blocks[1].top + "px",
                left: this.state.p2.blocks[1].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[2].color,
                width: this.state.p2.blocks[2].width + "px",
                height: this.state.p2.blocks[2].height + "px",
                top: this.state.p2.blocks[2].top + "px",
                left: this.state.p2.blocks[2].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[3].color,
                width: this.state.p2.blocks[3].width + "px",
                height: this.state.p2.blocks[3].height + "px",
                top: this.state.p2.blocks[3].top + "px",
                left: this.state.p2.blocks[3].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[4].color,
                width: this.state.p2.blocks[4].width + "px",
                height: this.state.p2.blocks[4].height + "px",
                top: this.state.p2.blocks[4].top + "px",
                left: this.state.p2.blocks[4].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[5].color,
                width: this.state.p2.blocks[5].width + "px",
                height: this.state.p2.blocks[5].height + "px",
                top: this.state.p2.blocks[5].top + "px",
                left: this.state.p2.blocks[5].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[6].color,
                width: this.state.p2.blocks[6].width + "px",
                height: this.state.p2.blocks[6].height + "px",
                top: this.state.p2.blocks[6].top + "px",
                left: this.state.p2.blocks[6].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[7].color,
                width: this.state.p2.blocks[7].width + "px",
                height: this.state.p2.blocks[7].height + "px",
                top: this.state.p2.blocks[7].top + "px",
                left: this.state.p2.blocks[7].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[8].color,
                width: this.state.p2.blocks[8].width + "px",
                height: this.state.p2.blocks[8].height + "px",
                top: this.state.p2.blocks[8].top + "px",
                left: this.state.p2.blocks[8].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[8].color,
                width: this.state.p2.blocks[8].width + "px",
                height: this.state.p2.blocks[8].height + "px",
                top: this.state.p2.blocks[8].top + "px",
                left: this.state.p2.blocks[8].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[9].color,
                width: this.state.p2.blocks[9].width + "px",
                height: this.state.p2.blocks[9].height + "px",
                top: this.state.p2.blocks[9].top + "px",
                left: this.state.p2.blocks[9].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[10].color,
                width: this.state.p2.blocks[10].width + "px",
                height: this.state.p2.blocks[10].height + "px",
                top: this.state.p2.blocks[10].top + "px",
                left: this.state.p2.blocks[10].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[11].color,
                width: this.state.p2.blocks[11].width + "px",
                height: this.state.p2.blocks[11].height + "px",
                top: this.state.p2.blocks[11].top + "px",
                left: this.state.p2.blocks[11].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[12].color,
                width: this.state.p2.blocks[12].width + "px",
                height: this.state.p2.blocks[12].height + "px",
                top: this.state.p2.blocks[12].top + "px",
                left: this.state.p2.blocks[12].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[13].color,
                width: this.state.p2.blocks[13].width + "px",
                height: this.state.p2.blocks[13].height + "px",
                top: this.state.p2.blocks[13].top + "px",
                left: this.state.p2.blocks[13].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[14].color,
                width: this.state.p2.blocks[14].width + "px",
                height: this.state.p2.blocks[14].height + "px",
                top: this.state.p2.blocks[14].top + "px",
                left: this.state.p2.blocks[14].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[15].color,
                width: this.state.p2.blocks[15].width + "px",
                height: this.state.p2.blocks[15].height + "px",
                top: this.state.p2.blocks[15].top + "px",
                left: this.state.p2.blocks[15].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[16].color,
                width: this.state.p2.blocks[16].width + "px",
                height: this.state.p2.blocks[16].height + "px",
                top: this.state.p2.blocks[16].top + "px",
                left: this.state.p2.blocks[16].left + "px"
              }}
            />
            <div
              style={{
                position: "absolute",
                backgroundColor: this.state.p2.blocks[17].color,
                width: this.state.p2.blocks[17].width + "px",
                height: this.state.p2.blocks[17].height + "px",
                top: this.state.p2.blocks[17].top + "px",
                left: this.state.p2.blocks[17].left + "px"
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
              height: "40px",
              width: "100%",
              textAlign: "center",
              position: "absolute",
              color: "black"
            }}
          >
            <p
              style={{
                width: "50%",
                float: "left"
              }}
            >
              {this.users[0]} has {this.state.you.score} points
            </p>
            <p
              style={{
                width: "50%",
                float: "right"
              }}
            >
              {this.users[1]} has {this.state.p2.score} points
            </p>
          </div>
        </div>
      );
    }
  }
}
