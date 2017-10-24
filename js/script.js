$(document).ready(function() {

  class Hangman {
    constructor() {
      this.lettersPresent = []
      this.lettersCrossed = []
      this.moves = 0
    }
    addLetters(input) {
      this.hiddenWord = input.toUpperCase()
      console.log(this.hiddenWord)
      for (let i = 0; i < this.hiddenWord.length; i++) {
        this.lettersPresent.push(this.hiddenWord[i])
        console.log[i]
      }
      console.log(this.letterPresent)
    }
  }

  class Game {
    constructor() {
      this.model = new Hangman()
      this.textInput = $('#text-input')
      this.textButton = $('#text-button')
      this.letterBoxes = $('.letter-boxes')
      this.gameBoard = $('#game-board')

      this.textButton.click(() => this.parseInput())
    }
    parseInput() {
      if (!this.model.hiddenWord) {
        this.model.addLetters(this.textInput.val())
        this.addLetterBoxes()
      } else if (this.textInput.upperCase() === this.model.hiddenWord) {
        //declare Winner
      } else {
        //compare Input
      }
    }
    addLetterBoxes() {
      this.model.lettersPresent.forEach((obj) => {
        if (obj === " ") {
          let character = `<div class='letter-space'></div>`
        } else {
          let character = `<div class='letter-boxes' data-letter='${obj}'></div>`
        }
        this.gameBoard.appendItem(character)
      })
    }
  }
  const hangman = new Game()
})
