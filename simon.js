// start by creating an array to keep track of the original sequence 
// of tile clicks and a second array for the human sequence:

let sequence = [];
let humanSequence = [];
let level = 0;  //keeps track of rounds


// select the start button and create a new startGame() function that will be executed when this button is clicked

const startButton = document.querySelector('.js-start');
const info = document.querySelector('.js-info');
const heading = document.querySelector('.js-heading');
const tileContainer = document.querySelector('.js-container');
    

    function resetGame(text) { // This function displays an alert and restores the game to its original state.
        alert(text);
        sequence = [];
        humanSequence = [];
        level = 0;
        startButton.classList.remove('hidden');
        heading.textContent = 'Simon Game';
        info.classList.add('hidden');
        tileContainer.classList.add('unclickable');
      }
  
    function humanTurn(level) {
        tileContainer.classList.remove('unclickable'); // This class prevents the buttons from being pressed when the game has not started and when the AI is not finished with the sequence of presses.
        info.textContent = `Your turn: ${level} Tap${level > 1 ? 's' : ''}`; // the contents of the info element is changed to indicate that the player can begin to repeat the sequence. It also shows how many taps needs to be entered.
      }

      function activateTile(color) {
        const tile = document.querySelector(`[data-tile='${color}']`);  // variables represent the next random tile in the array & the associated sound
        const sound = document.querySelector(`[data-sound='${color}']`);

    tile.classList.add('activated'); //adds activated class to the tile and plays associated sound
    sound.play();
  
    setTimeout(() => {
      tile.classList.remove('activated'); //after 300ms removes the activated class from the selected tile
    }, 300); // The effect is that each tile is activated for 300ms, and there are 300ms between tile activations in the sequence.

  }
  
  function playRound(nextSequence) { // The playRound() function takes a sequence array and iterates over it. 
    nextSequence.forEach((color, index) => { // the forEach method calls the provided function once for every array element in the order. 
      setTimeout(() => {
        activateTile(color);
      }, (index + 1) * 600); // It then uses the setTimeout() function to call the activateTile() at 600 millisecond intervals for each value in the sequence.
    });
  } 
    // The reason setTimeout() is used here is to add an artificial delay between each button press. 
    // Without it, the tiles in the sequence will be activated all at once.
    // The specified number of milliseconds in the setTimeout() function changes on each iteration by adding 1.
    // The first button in the sequence is activated after 600ms, the next one after 1200ms (600ms after the first), the third one after 1800ms, and so on.


    function nextStep() {
    const tiles = ['red', 'green', 'blue', 'yellow'];
    const random = tiles[Math.floor(Math.random() * tiles.length)]; // add a new random button press to the sequence with integer 0-4
  
    return random;
  }

    function nextRound() { // next sequence of tile clicks
        level += 1;

        tileContainer.classList.add('unclickable'); // the unclickable class is added to the tile container when the round starts
        info.textContent = 'Wait for the computer';
        heading.textContent = `Level ${level} of 20`; // and the contents of the info and heading elements are updated.

        const nextSequence = [...sequence];
        nextSequence.push(nextStep()); //the value is added to the end of the nextSequence() array alongside any values from the previous round.
        playRound(nextSequence);
        
        sequence = [...nextSequence]; // it now calls the array from nextSequence 
            setTimeout(() => {
            humanTurn(level);
        }, level * 600 + 1000);

        // The setTimeout() function above executes humanTurn() one second after the the last button in the sequence is activated.
        // The total duration of the sequence corresponds to the current level multiplied by 600ms which is the duration for each tile in the sequence.
        // The sequence variable is also assigned to the updated sequence.
    }

    function handleClick(tile) {
        const index = humanSequence.push(tile) - 1; // this removes whatever tile the player selects from that single press and stores it
        const sound = document.querySelector(`[data-sound='${tile}']`);
        sound.play();
      
        const remainingTaps = sequence.length - humanSequence.length;

        if (humanSequence[index] !== sequence[index]) { // in the event the player's sequence isn't equal to the computer, the game resets
            resetGame('Oops! Game over, you pressed the wrong tile');
            return;
          }

        if (humanSequence.length === sequence.length) { // this ends the game once player has matched 20 sequences
            if (humanSequence.length === 20) {
              resetGame('Congrats! You completed all the levels');
              return
            }
        }
      
        if (humanSequence.length === sequence.length) { // if they are equal, gameplay continues
          humanSequence = [];
          info.textContent = 'Success! Keep going!';
          setTimeout(() => {
            nextRound();
          }, 1000);
          return;
        }
      
        info.textContent = `Your turn: ${remainingTaps} Tap${
          remainingTaps > 1 ? 's' : ''
        }`;
        // This function pushes the tile value to the humanSequence array and stores its index in the index variable.
        // The corresponding sound for the button is played and the remaining steps in the sequence is calculated and updated on the screen.
        // The if block compares the length of the humanSequence array to sequence array. If they’re equal, it means that the round is over and the next round can begin.
        // At that point, the humanSequence array is reset and the nextRound() function is called after one second. 
        // The delay is to allow the user to see the success message, otherwise, it will not appear at all because it will get overwritten immediately.
        }

    function startGame() {
      startButton.classList.add('hidden');
      info.classList.remove('hidden');
      info.textContent = 'Wait for the computer';
      nextRound(); // Now, once you hit the start button, the first round will begin and a random button will be activated on the board.
    }
// once the start button is pressed, it will be hidden.
// the .info element also needs to come into view because that is where status messages will be displayed
// it has the hidden class by applied default in the HTML

startButton.addEventListener('click', startGame);
tileContainer.addEventListener('click', event => { // the value of data-tile on the element that was clicked is accessed and stored in the tile variable. 
    const { tile } = event.target.dataset;  // If the value is not an empty string (for elements without the data-tile attribute), the handleClick() function is executed with the tile value as its only argument.
  
    if (tile) handleClick(tile);
  });