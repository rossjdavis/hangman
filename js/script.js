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
      let input = this.textInput.val().toUpperCase()
      if (!this.inputIsEmpty(input)) {
        if (!this.model.hiddenWord) {
          this.model.addLetters(input)
          this.addLetterBoxes()
          this.textButton.text('Guess')
        } else if (input === this.model.hiddenWord) {
          //declare Winner
        } else {
          let matched = (this.model.checkForMatch(input))
          console.log(matched)
          this.flipLetterBoxes(matched, input)
        }
        this.textInput.val("")
      }
    }

    inputIsEmpty(input) {
      if (!input.length === 0) {
        return input
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
    flipLetterBoxes(matched, input) {
      if (!matched) {
        this.graveyard.append(`<div class='letter-grave' data-letter='${input}'>${input}</div>`)
      } else {
        this.letterBoxes.forEach((obj) => {
          if (matched.some(obj.data('letter'))) {
            obj.val(obj.data('letter'))
          }
        })
      }
    }
  }
  const hangman = new Game()
})
