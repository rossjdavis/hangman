$(document).ready(function() {

  class Hangman {
    constructor() {
      this.lettersPresent = []
      this.lettersCrossed = []
      this.moves = 0
    }
    addLetters(input) {
      this.hiddenWord = input
      for (let i = 0; i < this.hiddenWord.length; i++) {
        this.lettersPresent.push(this.hiddenWord[i])
      }
    }
    addMoves() {
      this.moves++
      return this.moves
    }
    checkForMatch(input) {
      this.lettersPresent.some((obj) => {
        if (obj === input) {
          return input
        } else {
          this.lettersCrossed.push(input)
          return false
        }
      })
    }
  }

  class Game {
    constructor() {
      this.model = new Hangman()
      this.textInput = $('#text-input')
      this.textButton = $('#text-button')
      this.letterBoxes = $('.letter-boxes')
      this.gameBoard = $('#game-board')
      this.graveyard = $('#graveyard')

      this.textButton.click(() => this.parseInput())
    }
    parseInput() {
      if (!this.model.hiddenWord) {
        this.model.addLetters(this.textInput.val().toUpperCase())
        this.addLetterBoxes()
        this.textInput.val("")
      } else if (this.textInput.val().toUpperCase() === this.model.hiddenWord) {
        //declare Winner
      } else {
        let matched = (this.model.checkForMatch(this.textInput.val().toUpperCase()))
        console.log(matched)
        this.flipLetterBoxes(matched, this.textInput.val().toUpperCase())
      }
    }

    addLetterBoxes() {
      this.model.lettersPresent.forEach((obj) => {
        if (obj === " ") {
          this.gameBoard.append(`<div class='letter-space'></div>`)
        } else {
          this.gameBoard.append(`<div class='letter-boxes' data-letter='${obj}'></div>`)
        }
      })
    }
    flipLetterBoxes(matched, obj) {
      if (!matched) {
        this.graveyard.append(`<div class='letter-boxes' data-letter='${obj}'></div>`)
      } else {
        this.letterBoxes.forEach((x) => {
          if (matched.some(x.data('letter'))) {
            x.val(x.data('letter'))
          }
        })
      }
    }
  }
  const hangman = new Game()
})
