$(document).ready(function() {
  class Hangman {
    constructor() {
      this.presentLetters = [];
      this.crossedLetters = [];
      this.moves = 0;
    }

    addLetters(input) {
      this.hiddenWord = input;
      for (let i = 0; i < this.hiddenWord.length; i++) {
        this.presentLetters.push(this.hiddenWord[i]);
      }
    }

    addMoves() {
      this.moves++;
      return this.moves;
    }

    checkForMatch(input) {
      let duplicate = this.isDuplicate(input);
      return this.presentLetters.some(obj => {
        if (obj === input) {
          return true;
        } else if (duplicate) {
          return true;
        } else {
          this.crossedLetters.push(input);
          return false;
        }
      });
    }

    isDuplicate(input) {
      return this.crossedLetters.some(obj => {
        return obj === input ? true : false;
      });
    }

    isWinner(flippedLetters) {
      let visibleWord = "";
      flippedLetters.each((i, element) => {
        if (element.classList.contains("flipped")) {
          visibleWord += element.dataset.letter;
        } else if (element.classList.contains("letter-space")) {
          visibleWord += `\u0020`;
        }
      });
      return visibleWord === this.hiddenWord ? true : false;
    }

    resetGame() {
      delete this.hiddenWord;
      this.presentLetters = [];
      this.crossedLetters = [];
      this.moves = 0;
    }
  }

  class Game {
    constructor() {
      this.model = new Hangman();
      this.gameBoard = $("#game-board");
      this.gameState = $("#game-state");
      this.textButton = $("#text-button");
      this.textSource = $("#text-source");
      this.graveyard = $("#graveyard");

      this.score = sessionStorage.getItem("score")
        ? parseInt(sessionStorage.getItem("score"))
        : 0;

      this.scoreBoard = $("#score #value");
      this.scoreBoard.text(this.score);

      this.textButton.click(() => this.parseInput());
      this.textSource.keypress(this.parseEnter);
      this.scoreBoard.click(() => this.resetScore());
    }

    resetScore() {
      this.score = 0;
      this.updateScore(this.score);
    }

    parseEnter(event) {
      if (event.which === 13) {
        event.preventDefault();
        $("#text-button").click();
      }
    }

    parseInput() {
      let input = this.textSource.val().toUpperCase();

      if (!this.inputHasValue(input)) {
        return;
      }

      if (!this.model.hiddenWord) {
        this.startNewGame(input);
      } else if (input === this.model.hiddenWord) {
        this.flipAllBoxes();
      } else {
        let matched = this.model.checkForMatch(input);
        this.flipLetterBoxes(matched, input);
      }

      this.textSource.val("");
    }

    inputHasValue(input) {
      return input.length !== 0 ? true : false;
    }

    startNewGame(input) {
      this.flippedLetters = [];
      this.removeBody();
      this.model.addLetters(input);
      this.addLetterBoxes();
      this.textButton.text("Guess");
    }

    addLetterBoxes() {
      this.model.presentLetters.forEach(obj => {
        if (obj === `\u0020`) {
          this.gameBoard.append(`<div class='letter-space'></div>`);
        } else {
          this.gameBoard.append(
            `<div class='letter-boxes' data-letter='${obj}'></div>`
          );
        }
      });
    }

    flipLetterBoxes(matched, input) {
      if (matched) {
        $(".letter-boxes").each((i, element) => {
          if (input === element.dataset.letter) {
            element.innerHTML = input;
            element.classList.add("flipped");
          }
        });
        this.updateScore(5);
        this.checkForWinner(input);
      } else {
        this.addToGraveyard(input);
      }
    }

    // updateStyle(element) {
    //   element.classList.add("flipped");
    //   element.style.background = "darkorange";
    //   element.style.border = "1px dashed white";
    //   element.style.color = "white";
    // }

    updateScore(score) {
      this.score += score;
      this.scoreBoard.text(this.score);
      sessionStorage.setItem("score", this.score);
    }

    addHoverToWord() {
      $(".letter-grave").hover(
        function() {
          if ($(this).text() === "@") {
            let word = $(this).data("letter");
            $(this).addClass("letter-hover");
            // $(this)
            //   .children()
            //   .css("display", "flex");
            $("#description").text(word);
            $("#description").css("display", "flex");
            // $("#description").css("top", 100);
            // $("#description").css("margin-right");
          }
        },
        function() {
          $(this).removeClass("letter-hover");
          // $(this)
          //   .children()
          //   .css("display", "none");
          $("#description").css("display", "none");
        }
      );
    }

    addToGraveyard(input) {
      if (input.length > 1) {
        this.graveyard.append(
          `<div class='letter-grave' data-letter='${input}'>@</div>`
        );
        this.addHoverToWord();
      } else {
        this.graveyard.append(
          `<div class='letter-grave' data-letter='${input}'>${input}</div>`
        );
      }
      this.hangBodyPart();
    }

    // addDescription(input) {
    //   let element = this.graveyard.children().last();
    //   element.append(`<span class='description'>${input}</span>`);
    //   element.children().css("top", "200px");
    //   element.children().css("z-index", 0);
    //   this.addHoverToWord();
    // }

    hangBodyPart() {
      $(".hangman-zero")
        .first()
        .removeClass("hangman-zero");
      this.isGameOver();
    }

    flipAllBoxes() {
      this.flippedLetters = $("#game-board").children();
      this.flippedLetters.each((i, element) => {
        this.flipLetterBoxes(true, element.dataset.letter);
      });
      this.declareWinner();
    }

    checkForWinner(input) {
      this.flippedLetters = $("#game-board").children();
      if (this.model.isWinner(this.flippedLetters)) {
        this.declareWinner();
      }
    }

    isGameOver() {
      if (this.model.addMoves() === 6) {
        this.gameState.text("GAME OVER");
        this.resetGame();
      }
    }

    declareWinner() {
      this.gameState.text("WINNER");
      this.resetGame();
    }

    removeLetterBoxes() {
      $(".letter-grave").each((i, element) => element.remove());
      $(".letter-space").each((i, element) => element.remove());
      $(".letter-boxes").each((i, element) => element.remove());
      this.removeGameState();
    }

    removeBody() {
      $("#inner-container")
        .children()
        .each((i, element) => (element.className = "hangman-zero"));
      this.removeLetterBoxes();
    }

    removeGameState() {
      this.gameState.text("");
    }

    resetGame() {
      this.model.resetGame();
      this.textButton.text("Set Word");
    }
  }
  const hangman = new Game();
});
