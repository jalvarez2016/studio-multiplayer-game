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
        ]
      },
      youScore: 0
    };
    this.getSessionDatabaseRef().set({
      ball: this.state.ball,
      ball2: this.state.ball2,
      P1: {
        name: this.users[0],
        x_cord: this.state.you.left,
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
        ]
      }
    });
  }

  ballMove() {
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
        this.state.you.left - derp + paddleWidth / 2 > left + ballR
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
            ballSpeedY = -ballSpeedY;
            currentBlock.durabilityNum -= 1;
            console.log(currentBlock.durabilityNum);
            this.checkBlock(currentBlock);
          } else if (
            top <= blocks[i].top + blocks[i].height &&
            top >= blocks[i].top
          ) {
            ballSpeedX = -ballSpeedX;
            ballSpeedY = -ballSpeedY;
            currentBlock.durabilityNum -= 1;
            console.log(currentBlock.durabilityNum);
            this.checkBlock(currentBlock);
          }
        } else if (
          left + ballR >= blocks[i].left + blocks[i].width &&
          left + ballR <= blocks[i].left + blocks[i].width + 2
        ) {
          if (
            top + ballR <= blocks[i].top + blocks[i].height &&
            top + ballR >= blocks[i].top
          ) {
            ballSpeedX = -ballSpeedX;
            ballSpeedY = -ballSpeedY;
            currentBlock.durabilityNum -= 1;
            console.log(currentBlock.durabilityNum);
            this.checkBlock(currentBlock);
          } else if (
            top <= blocks[i].top + blocks[i].height &&
            top >= blocks[i].top
          ) {
            ballSpeedX = -ballSpeedX;
            ballSpeedY = -ballSpeedY;
            currentBlock.durabilityNum -= 1;
            console.log(currentBlock.durabilityNum);
            this.checkBlock(currentBlock);
          }
        } else if (
          left >= blocks[i].left + blocks[i].width &&
          left <= blocks[i].left + blocks[i].width + 2
        ) {
          if (
            top + ballR <= blocks[i].top + blocks[i].height &&
            top + ballR >= blocks[i].top
          ) {
            ballSpeedX = -ballSpeedX;
            ballSpeedY = -ballSpeedY;
            currentBlock.durabilityNum -= 1;
            console.log(currentBlock.durabilityNum);
            this.checkBlock(currentBlock);
          } else if (
            top <= blocks[i].top + blocks[i].height &&
            top >= blocks[i].top
          ) {
            ballSpeedX = -ballSpeedX;
            ballSpeedY = -ballSpeedY;
            currentBlock.durabilityNum -= 1;
            console.log(currentBlock.durabilityNum);
            this.checkBlock(currentBlock);
          }
        } else if (left >= blocks[i].left && left <= blocks[i].left + 2) {
          if (
            top + ballR <= blocks[i].top + blocks[i].height &&
            top + ballR >= blocks[i].top
          ) {
            ballSpeedX = -ballSpeedX;
            ballSpeedY = -ballSpeedY;
            currentBlock.durabilityNum -= 1;
            console.log(currentBlock.durabilityNum);
            this.checkBlock(currentBlock);
          } else if (
            top <= blocks[i].top + blocks[i].height &&
            top >= blocks[i].top
          ) {
            ballSpeedX = -ballSpeedX;
            ballSpeedY = -ballSpeedY;
            currentBlock.durabilityNum -= 1;
            console.log(currentBlock.durabilityNum);
            this.checkBlock(currentBlock);
          }
        } else if (
          left + ballR <= blocks[i].left + blocks[i].width &&
          left + ballR >= blocks[i].left
        ) {
          if (
            top + ballR <= blocks[i].top + blocks[i].height &&
            top + ballR >= blocks[i].top
          ) {
            ballSpeedY = -ballSpeedY;
            currentBlock.durabilityNum -= 1;
            console.log(currentBlock.durabilityNum);
            this.checkBlock(currentBlock);
          } else if (
            top <= blocks[i].top + blocks[i].height &&
            top >= blocks[i].top
          ) {
            ballSpeedY = -ballSpeedY;
            currentBlock.durabilityNum -= 1;
            console.log(currentBlock.durabilityNum);
            this.checkBlock(currentBlock);
          }
        } else if (
          left <= blocks[i].left + blocks[i].width &&
          left >= blocks[i]
        ) {
          if (
            top + ballR <= blocks[i].top + blocks[i].height &&
            top + ballR >= blocks[i].top
          ) {
            ballSpeedY = -ballSpeedY;
            currentBlock.durabilityNum -= 1;
            console.log(currentBlock.durabilityNum);
            this.checkBlock(currentBlock);
          } else if (
            top <= blocks[i].top + blocks[i].height &&
            top >= blocks[i].top
          ) {
            ballSpeedY = -ballSpeedY;
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
    } else {
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
        if (top2 >= paddleY && top2 + ballR2 <= paddleY + paddleHeight) {
          ballSpeedY2 = -ballSpeedY2;
          var delta2 = left - (this.state.you.left - derp + paddleHeight / 2);
          ballSpeedX = delta2 * 0.25;
        }
      }

      //block collsions

      for (var x = 0; x < blocks2.length; x++) {
        var currentBlock2;
        if (
          left2 + ballR2 >= blocks2[i].left &&
          left2 + ballR2 <= blocks2[i].left + 2
        ) {
          if (
            top2 + ballR2 <= blocks2[i].top + blocks2[i].height &&
            top2 + ballR2 >= blocks2[i].top
          ) {
            ballSpeedX2 = -ballSpeedX2;
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            console.log(currentBlock2.durabilityNum);
            this.checkBlock(currentBlock2);
          } else if (
            top2 <= blocks2[i].top + blocks2[i].height &&
            top2 >= blocks2[i].top
          ) {
            ballSpeedX2 = -ballSpeedX2;
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            console.log(currentBlock2.durabilityNum);
            this.checkBlock(currentBlock2);
          }
        } else if (
          left2 + ballR2 >= blocks2[i].left + blocks2[i].width &&
          left2 + ballR2 <= blocks2[i].left + blocks2[i].width + 2
        ) {
          if (
            top2 + ballR2 <= blocks2[i].top + blocks2[i].height &&
            top2 + ballR2 >= blocks2[i].top
          ) {
            ballSpeedX2 = -ballSpeedX2;
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            console.log(currentBlock2.durabilityNum);
            this.checkBlock(currentBlock2);
          } else if (
            top2 <= blocks2[i].top + blocks2[i].height &&
            top2 >= blocks2[i].top
          ) {
            ballSpeedX2 = -ballSpeedX2;
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            console.log(currentBlock2.durabilityNum);
            this.checkBlock(currentBlock2);
          }
        } else if (
          left2 >= blocks2[i].left + blocks2[i].width &&
          left2 <= blocks2[i].left + blocks2[i].width + 2
        ) {
          if (
            top2 + ballR2 <= blocks2[i].top + blocks2[i].height &&
            top2 + ballR2 >= blocks2[i].top
          ) {
            ballSpeedX2 = -ballSpeedX2;
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            console.log(currentBlock2.durabilityNum);
            this.checkBlock(currentBlock2);
          } else if (
            top2 <= blocks2[i].top + blocks2[i].height &&
            top2 >= blocks2[i].top
          ) {
            ballSpeedX2 = -ballSpeedX2;
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            console.log(currentBlock2.durabilityNum);
            this.checkBlock(currentBlock2);
          }
        } else if (left2 >= blocks2[i].left && left2 <= blocks2[i].left + 2) {
          if (
            top2 + ballR2 <= blocks2[i].top + blocks2[i].height &&
            top2 + ballR2 >= blocks2[i].top
          ) {
            ballSpeedX2 = -ballSpeedX2;
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            console.log(currentBlock2.durabilityNum);
            this.checkBlock(currentBlock2);
          } else if (
            top2 <= blocks2[i].top + blocks2[i].height &&
            top2 >= blocks2[i].top
          ) {
            ballSpeedX2 = -ballSpeedX2;
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            console.log(currentBlock2.durabilityNum);
            this.checkBlock(currentBlock2);
          }
        } else if (
          left2 + ballR2 <= blocks2[i].left + blocks2[i].width &&
          left2 + ballR2 >= blocks2[i].left
        ) {
          if (
            top2 + ballR2 <= blocks2[i].top + blocks2[i].height &&
            top2 + ballR2 >= blocks2[i].top
          ) {
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            console.log(currentBlock2.durabilityNum);
            this.checkBlock(currentBlock2);
          } else if (
            top2 <= blocks2[i].top + blocks2[i].height &&
            top2 >= blocks2[i].top
          ) {
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            console.log(currentBlock2.durabilityNum);
            this.checkBlock(currentBlock2);
          }
        } else if (
          left2 <= blocks2[i].left + blocks2[i].width &&
          left2 >= blocks2[i]
        ) {
          if (
            top2 + ballR2 <= blocks2[i].top + blocks2[i].height &&
            top2 + ballR2 >= blocks2[i].top
          ) {
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            console.log(currentBlock2.durabilityNum);
            this.checkBlock(currentBlock2);
          } else if (
            top2 <= blocks2[i].top + blocks2[i].height &&
            top2 >= blocks2[i].top
          ) {
            ballSpeedY2 = -ballSpeedY2;
            currentBlock2.durabilityNum -= 1;
            console.log(currentBlock2.durabilityNum);
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
    }

    if (this.isCreator) {
      this.getSessionDatabaseRef().update({
        P1: {
          name: this.users[0],
          x_cord: this.state.you.left,
          score: this.state.you.score + 1, //change to the state score later
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
          score: this.state.p2.score + 1, //change to the state score later
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
    //console.log(data);
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
