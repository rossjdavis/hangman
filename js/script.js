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
      let duplicate = this.isDuplicate(input)
      return this.lettersPresent.some((obj) => {
        if (obj === input) {
          return true
        } else if (duplicate) {
          return true
        } else {
          this.lettersCrossed.push(input)
          return false
        }
      })
    }
    isDuplicate(input) {
      return this.lettersCrossed.some((obj) => {
        if (obj === input) {
          return true
        } else {
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
      this.gameBoard = $('#game-board')
      this.graveyard = $('#graveyard')

      this.textButton.click(() => this.parseInput())
    }
    parseInput() {
      let input = this.textInput.val().toUpperCase()
      if (this.notEmpty(input)) {
        if (!this.model.hiddenWord) {
          this.model.addLetters(input)
          this.addLetterBoxes()
          this.textButton.text('Guess')
        } else if (input === this.model.hiddenWord) {
          //declare Winner
        } else {
          let matched = (this.model.checkForMatch(input))
          this.flipLetterBoxes(matched, input)
        }
        this.textInput.val("")
      }
    }

    notEmpty(input) {
      if (input.length !== 0) {
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
      if (matched) {
        $('.letter-boxes').each((i, element) => {
          if (input === element.dataset.letter) {
            element.innerHTML = input
          }
        })
      } else {
        this.graveyard.append(`<div class='letter-grave' data-letter='${input}'>${input}</div>`)
        this.hangBodyPart()
      }
    }

    hangBodyPart() {
      $('.hangman-zero').first().removeClass('hangman-zero')
      this.isGameOver()
    }

    isGameOver() {
      if (this.model.addMoves()===6) {
        console.log("game over")
      }
    }
  }
  const hangman = new Game()
})
