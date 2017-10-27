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

    updateScore(score) {
      this.score += score;
      this.scoreBoard.text(this.score);
      sessionStorage.setItem("score", this.score);
    }

    addHoverToWord(input) {
      $(".letter-grave").hover(
        function() {
          if ($(this).text() === "@") {
            let offsetTop = $(this).offset().top;
            let offsetLeft = $(this).offset().left;
            $(this).addClass("letter-hover");
            $("#graveyard-box").text($(this).data("letter"));
            $("#graveyard-box").css("display", "block");
            $("#graveyard-box").css("top", offsetTop + 50);
            $("#graveyard-box").css("left", offsetLeft - 20);
          }
        },
        function() {
          $(this).removeClass("letter-hover");
          $("#graveyard-box").css("display", "none");
        }
      );
    }

    addToGraveyard(input) {
      if (input.length > 1) {
        let deadWord = `<div class='letter-grave' data-letter='${input}'>@</div>`;
        this.graveyard.append(deadWord);
        this.addHoverToWord(deadWord);
      } else {
        this.graveyard.append(
          `<div class='letter-grave' data-letter='${input}'>${input}</div>`
        );
      }
      this.hangBodyPart();
    }

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

    resetScore() {
      sessionStorage.setItem("score", 0);
    }

    resetGame() {
      this.model.resetGame();
      this.textButton.text("Set Word");
    }
  }
  const hangman = new Game();
});
