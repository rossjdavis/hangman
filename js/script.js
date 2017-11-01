$(document).ready(function() {
  class Hangman {
    constructor() {
      this.presentLetters = []
      this.crossedLetters = []
      this.moves = 0
    }

    // set the word and and add letters to array
    addLetters(input) {
      this.hiddenWord = input
      for (let i = 0; i < this.hiddenWord.length; i++) {
        this.presentLetters.push(this.hiddenWord[i])
      }
    }

    // increment moves and return value
    addMoves() {
      this.moves++
      return this.moves
    }

    // return true for duplicate or matched letter
    // otherwise return false & push dead letter to crossed array
    checkForMatch(input) {
      let duplicate = this.isDuplicate(input)
      return this.presentLetters.some(obj => {
        if (obj === input) {
          return true
        } else if (duplicate) {
          return true
        } else {
          this.crossedLetters.push(input)
          return false
        }
      })
    }

    // return true if letter has been guessed already
    isDuplicate(input) {
      return this.crossedLetters.some(obj => {
        return obj === input ? true : false
      })
    }

    // combine flipped letters and compare to the hidden word
    // return true if matched, otherwise return false
    isWinner(flippedLetters) {
      let visibleWord = ""
      flippedLetters.each((i, element) => {
        if (element.classList.contains("flipped")) {
          visibleWord += element.dataset.letter
        } else if (element.classList.contains("letter-space")) {
          visibleWord += `\u0020`
        }
      })
      return visibleWord === this.hiddenWord ? true : false
    }

    // remove hidden word and clear the arrays
    // set movest to zero
    resetGame() {
      delete this.hiddenWord
      this.presentLetters = []
      this.crossedLetters = []
      this.moves = 0
    }
  }

  class Game {
    constructor() {
      this.model = new Hangman()
      this.gameBoard = $("#game-board")
      this.gameState = $("#game-state")
      this.textButton = $("#text-button")
      this.textSource = $("#text-source")
      this.graveyard = $("#graveyard")

      // retrieve persistent score from session
      // set score to zero if it doesnt exist
      this.score = sessionStorage.getItem("score")
        ? parseInt(sessionStorage.getItem("score"))
        : 0

      // update the score in HTML
      this.scoreBoard = $("#score #value")
      this.scoreBoard.text(this.score)

      // add event listeners
      this.textButton.click(() => this.parseInput())
      this.textSource.keypress(this.parseEnter)
      this.scoreBoard.click(() => this.resetScore())
    }

    // set score to zero and update variables
    resetScore() {
      this.score = 0
      this.updateScore(this.score)
    }

    // click button if enter is pressed
    parseEnter(event) {
      if (event.which === 13) {
        event.preventDefault()
        $("#text-button").click()
      }
    }

    parseInput() {
      // every input will be uppercase for comparison
      let input = this.textSource.val().toUpperCase()
      // do nothing if input is empty
      if (!this.inputHasValue(input)) {
        return
      }
      // if there is no word, start new game
      if (!this.model.hiddenWord) {
        this.startNewGame(input)
        // if user enters the matching word, the game is won
      } else if (input === this.model.hiddenWord) {
        this.flipAllBoxes()
        // match will be true if letter is present
        // flip the boxes with true or false and input arguments
      } else {
        let matched = this.model.checkForMatch(input)
        this.flipLetterBoxes(matched, input)
      }
      // remove text from input box
      this.textSource.val("")
    }

    // do nothing if input is blank
    inputHasValue(input) {
      return input.length !== 0 ? true : false
    }

    // reset all vaues
    startNewGame(input) {
      this.flippedLetters = []
      this.removeBody()
      this.model.addLetters(input)
      this.addLetterBoxes()
      this.textButton.text("Guess")
    }

    // add boxes for the hidden word and blank divs for spaces
    addLetterBoxes() {
      this.model.presentLetters.forEach(obj => {
        if (obj === `\u0020`) {
          this.gameBoard.append(`<div class='letter-space'></div>`)
        } else {
          this.gameBoard.append(
            `<div class='letter-boxes' data-letter='${obj}'></div>`
          )
        }
      })
    }

    // if letter is present return true and check for WINNER
    // if letter is not, return false and add letter to graveyard
    flipLetterBoxes(matched, input) {
      if (matched) {
        $(".letter-boxes").each((i, element) => {
          if (input === element.dataset.letter) {
            if (!element.classList.contains("flipped")) {
              this.updateScore(5)
            }
            element.innerHTML = input
            element.classList.add("flipped")
          }
        })
        this.checkForWinner(input)
      } else {
        this.addToGraveyard(input)
      }
    }

    // get score and update HTML and session storage variable
    updateScore(score) {
      this.score += score
      this.scoreBoard.text(this.score)
      sessionStorage.setItem("score", this.score)
    }

    // word hovers under corresponding @ box
    addHoverToWord() {
      $(".letter-grave").hover(
        function() {
          let self = $(this)
          if (self.text() === "@") {
            let word = self.data("letter")
            let offset = self.offset().left - 40
            self.addClass("letter-hover")
            $("#description").text(word)
            $("#description").css("display", "block")
            $("#description").css("top", 50)
            $("#description").css("left", offset + self.outerWidth())
          }
        },
        function() {
          let self = $(this)
          self.removeClass("letter-hover")
          $("#description").css("display", "none")
        }
      )
    }

    // add word to graveyard with @ symbol if length is > 1
    // otherwise add letter
    // then hang the next body part
    addToGraveyard(input) {
      if (input.length > 1) {
        this.graveyard.append(
          `<div class='letter-grave' data-letter='${input}'>@</div>`
        )
        this.addHoverToWord()
      } else {
        this.graveyard.append(
          `<div class='letter-grave' data-letter='${input}'>${input}</div>`
        )
      }
      this.hangBodyPart()
    }

    // remove hangman-zero class from first element to display next body part
    hangBodyPart() {
      $(".hangman-zero")
        .first()
        .removeClass("hangman-zero")
      this.isGameOver()
    }

    // loop through all children of game-board and flip their boxes
    flipAllBoxes() {
      this.flippedLetters = $("#game-board").children()
      this.flippedLetters.each((i, element) => {
        this.flipLetterBoxes(true, element.dataset.letter)
      })
      this.declareWinner()
    }

    // get array of game-board children
    // declare winner if isWinner returns true
    checkForWinner(input) {
      this.flippedLetters = $("#game-board").children()
      if (this.model.isWinner(this.flippedLetters)) {
        this.declareWinner()
      }
    }

    // display GAME OVER and reset game
    isGameOver() {
      if (this.model.addMoves() === 6) {
        this.gameState.text("GAME OVER")
        this.resetGame()
      }
    }

    // display WINNER and reset game
    declareWinner() {
      this.gameState.text("WINNER")
      this.resetGame()
    }

    // loop through all letter boxes and remove them
    // clear GAME OVER or WINNER
    removeLetterBoxes() {
      $(".letter-grave").each((i, element) => element.remove())
      $(".letter-space").each((i, element) => element.remove())
      $(".letter-boxes").each((i, element) => element.remove())
      this.removeGameState()
    }

    // loop through all body parts and remove them
    removeBody() {
      $("#inner-container")
        .children()
        .each((i, element) => (element.className = "hangman-zero"))
      this.removeLetterBoxes()
    }

    // clear GAME OVER or WINNER
    removeGameState() {
      this.gameState.text("")
    }

    // reset the game and change button to Set Word
    resetGame() {
      this.model.resetGame()
      this.textButton.text("Set Word")
    }
  }
  const hangman = new Game()
})
