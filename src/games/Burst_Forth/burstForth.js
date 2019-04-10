import GameComponent from "../../GameComponent.js";
import React from "react";
import UserApi from "../../UserApi.js";
import firebase from "firebase";

const W = 900;
const H = 700;
const R = 20;
const paddleWidth = 100,
  paddleHeight = 10,
  paddleY = H - 100;

export default class burst_Forth extends GameComponent {
  constructor(props) {
    super(props);
    this.user = firebase.auth().currentUser.uid;
    this.isCreator = this.user === props.location.state.creator;
    this.session = firebase
      .database()
      .ref(`/session/${props.location.state.id}`);
    if (this.isCreator) {
      this.player = this.session.child("left");
    } else {
      this.player = this.session.child("right");
    }
    this.state = {
      winner: false,
      started: true,
      ball: {
        x: W / 2 - R,
        y: H / 2 - R,
        dx: Math.random() * -3 - 2,
        dy: Math.random() * 6 - 3
      },
      left: {
        userid: this.user,
        height: H / 2 - paddleHeight / 2
      },
      right: {
        height: H / 2 - paddleHeight / 2
      }
    };

    // this.isCreator = this.user === props.location.state.creator;
    // this.session = firebase
    //   .database()
    //   .ref(`/session/${props.location.state.id}`);
    // if (this.isCreator) {
    //   this.player = this.session.child("left");
    // } else {
    //   this.player = this.session.child("right");
    // }
    // this.ball = this.session.child("ball");
    // this.state = { winner: false, started: false };
    // this.started = this.session.child("started");
    // this.started.on("value", snapshot => {
    //   if (snapshot.val()) {
    //     this.onGameStarted();
    //   }
    // });
    // this.winner = this.session.child("winner");
    // this.winner.on("value", snapshot => {
    //   if (snapshot.val() !== false) {
    //     this.onGameOver();
    //   }
    // });
    // this.session.on("value", snapshot => {
    //   this.setState(snapshot.val());
    // });
  }

  onMouseMove(e) {
    this.player.update({ height: e.clientY - paddleHeight });
  }

  onGameStarted() {
    // if (this.isCreator) {
    //   var initState = {
    //     winner: false,
    //     started: true,
    //     ball: {
    //       x: W / 2 - R,
    //       y: H / 2 - R,
    //       dx: Math.random() * -3 - 2,
    //       dy: Math.random() * 6 - 3
    //     },
    //     left: {
    //       userid: this.user,
    //       height: H / 2 - paddleHeight / 2
    //     },
    //     right: {
    //       height: H / 2 - paddleHeight / 2
    //     }
    //   };
    //   if (this.props.location.state.users.length === 1) {
    //     initState.right.userid = 0;
    //   } else {
    //     this.props.location.state.users.forEach(uid => {
    //       if (uid !== this.user) {
    //         initState.right.userid = uid;
    //       }
    //     });
    //   }
    //   this.session.set(initState);
    //   this.setState(initState);
    //   this.interval = setInterval(() => this.gameLoop(), 10);
    // }
  }

  // handleButtonClick() {
  //   this.getSessionDatabaseRef().set({ user_id: this.getMyUserId() });
  // }

  render() {
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
            position: "relative",
            backgroundColor: "white",
            width: paddleWidth + "px",
            height: paddleHeight + "px",
            top: paddleY + "px"
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
