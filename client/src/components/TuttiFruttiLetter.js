import React from "react";
import shuffle from "../services/tuttiFrutti";
import { Animated } from "react-animated-css";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { Redirect } from "react-router-dom";
import PopUpWin from "./PopUpWin"
import PopUpLose from "./PopUpLose"
import GreetingMessage from "./GreetingMessage"

class TuttiFruttiLetter extends React.Component {
  state = {
    cards: [],
    currentLetter: "",
    redirect: false,
    score: 0,
    active: false,
    tries: 3,
    right: 0,
    showGoodMessage: false,
    isVisible: false,
    classStyle :"wrongImg"
  };

  handleClick = (event, card) => {
    console.log(card)
    if (card.letter === this.state.currentLetter) { 
      console.log(card._id) 
      if(this.state.right === 2){
        console.log("3 rights")
        this.setState({
        active : false,
      });
      }
 
      this.setState({
        score: this.state.score + 10,
        showGoodMessage: true,
        right: this.state.right + 1,
        isVisible: true
      });
      setTimeout(
        function () {
          this.setState({ showGoodMessage: false});
        }.bind(this),
        2000
      )
    } else if (card.letter !== this.state.currentLetter) {
      if(this.state.tries === 1){
        this.setState({
       active : false
      });
      }
      this.setState({
        score: this.state.score - 10,
        tries: this.state.tries - 1
      });
    }
  };
 
  getCards = () => {
    axios.get("/api/games/tutti-frutti").then((cardsFound) => {
      const letter = this.props.match.params.letter;
      console.log(letter);
      this.setState({
        currentLetter: letter,
        cards: shuffle(cardsFound.data.cards),
        active: !this.state.active,
      });
    });
  };

  componentDidMount = () => {
    this.getCards();
  };

  handleRedirect = () => {
    this.setState({
      redirect: true,
    });
  };
  componentWillUnmount() {
    this.active = false;
  }
  render() {
    // console.log(this.state.cards)
    return (
      <div className = "displayGame">
        {this.state.tries <= 0 && (
        <PopUpLose buttonMethod = {this.handleRedirect}/>
        )}
        {this.state.right === 3 && (
        <PopUpWin buttonMethod = {this.handleRedirect}/>
        )}
        {this.state.active && (
          <div className = "score">
          <div className = "gameInfo">
        {this.state.showGoodMessage && <GreetingMessage />}
            <h1>Score : {this.state.score} </h1> 
            <h1>Tries : {this.state.tries}</h1> 
            <div className = "currentLetter bounce">
            <h1>{this.state.currentLetter}</h1> 
            </div>
            </div>

            <div className="dashBoard">
              {this.state.cards.map((card, i) => {
                return (
                    <div  key={i}>
                      <img
                        className= {this.state.classStyle} 
                        src={card.image}
                        onClick={(e) => {
                          this.handleClick(e, card);
                        }}
                      />
                </div>
                );
              })}
            </div>
          </div>
        )}
        {this.state.redirect && <Redirect to="/games/tutti-frutti" />}
      </div>
    );
  }
}
export default TuttiFruttiLetter;
