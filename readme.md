# Hangman

The purpose of this application is to deploy the Hangman game in the browser.

## The rules are simple:
* Player One chooses a word and clicks 'Set Word'
* Player Two will enter letter or phrase guesses into the box and click 'Guess'
* Player will earn 5 points for each letter guessed
* Player can keep guessing until all body parts have been displayed
* After game is complete, a new word or phrase can be entered

## Features:
* Score is visible in the upper left corner
* Dead letters or words are visible in the upper right corner
* Hover over '@' to see the dead word or phrase
* You can guess individual letters, or the entire word or phrase

## Technologies:
* I decided to take the Model/View approach in order to learn it
* JavaScript and JQuery (where I wasn't forced to use standard JS for DOM manipulation)

## Installation:
1. Fork and clone the [project repsository](https://github.com/rossjdavis/hangman/tree/gh-pages")
2. Navigate to the hangman folder
```
cd hangman
```
3. Run the game
```
open index.html
```
4. Enjoy!

## Unsolved Problems:
* Cannot get the floating word positioned properly below it's corresponding box
* It should justify right and grow to the left
