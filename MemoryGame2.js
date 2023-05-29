const cards = document.querySelectorAll('.memory-card');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const inputContainer = document.getElementById('input-container');
const timerElement = document.getElementById('timer');
const cardsContainer = document.getElementById('cards-container');
const nameError = document.getElementById('name-error');
const CardNameError = document.getElementById('card-name-error');
const stopGame = document.getElementById('stop-game');
const playerName = document.getElementById('player-name');
const playerNameElement = document.getElementById('display-name');


let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let startTime, timerInterval;
let restartCounter = 0;
let cardAmount;
var nameDisable = false;
function startGame() {
    cardAmount = parseInt(document.getElementById('card-num').value);
    const cardError = document.getElementById('card-error');
    const playerName = document.getElementById('player-name').value;

    if (nameDisable == true) {
        enableDisplayPlayerName(playerName);
        nameDisable = false;
    }

    startButton.style.display = 'none';


    let checkNameCard = 0;
    checkNameCard = isNumberValid(cardAmount);
    checkNameCard += isNameValid(playerName);
    if (checkNameCard == 3) {
        //name and card are not between 2-30.
        startButton.style.display = 'block';
        //deleteing the last errors in case of the user failling more than 2 times.
        nameError.style.display = 'none';
        cardError.style.display = 'none';
        CardNameError.style.display = 'block';
        stopGame.style.display = 'none';
        document.getElementById('messi').volume = 0.4;
        document.getElementById('messi').play();
        return;
    }
    if (checkNameCard == 1) {
        //cards are not between 2-30.
        stopGame.style.display = 'none';
        startButton.style.display = 'block';//making the button visibile
        nameError.style.display = 'none';
        CardNameError.style.display = 'none';
        cardError.style.display = 'block';
        document.getElementById('messi').volume = 0.4;
        document.getElementById('messi').play();
        return;
    } else if (checkNameCard == 2) {
        stopGame.style.display = 'none';
        startButton.style.display = 'block';
        //name is not between 2-30.
        CardNameError.style.display = 'none';
        cardError.style.display = 'none';
        nameError.style.display = 'block';
        document.getElementById('messi').volume = 0.4;
        document.getElementById('messi').play();
        return;
    } else if (checkNameCard == 0) {
        stopGame.style.display = 'none';
        startButton.style.display = 'block';
        let name = document.getElementById('input-container');
        name.style.display = 'none';
        startTimer();
        displayPlayerName(playerName);
        displayTimer();
    }

    startButton.style.display = 'none';
    stopGame.style.display = 'block';
    CardNameError.style.display = 'none';
    cardError.style.display = 'none';
    nameError.style.display = 'none';


    //counter to check if theres any cards left.
    restartCounter = cardAmount;

    const screenWidth = window.innerWidth;
    let cardsPerRow;
    let maxCardsPerRow;

    if (screenWidth >= 1200) {
        cardsPerRow = 6;
    } else if (screenWidth >= 992) {
        cardsPerRow = 4;
    } else if (screenWidth >= 576) {
        cardsPerRow = 3;
    } else {
        cardsPerRow = 2;
    }

    if (cardAmount === 2) {
        maxCardsPerRow = 2;
    } else {
        maxCardsPerRow = 6;
    }

    const totalCards = cardAmount * 2;
    const visibleCards = Array.from(cards).slice(0, totalCards);

    const minCardWidth = 850; // Minimum width for each card in pixels

    const numCardsPerRow = Math.max(Math.min(visibleCards.length, maxCardsPerRow), cardsPerRow);
    const cardWidth = `calc(100% / ${numCardsPerRow} - 30px)`;
    const cardHeight = `calc(${minCardWidth}px / ${numCardsPerRow} - 30px)`;

    const remainingCards = totalCards % cardsPerRow;


    cards.forEach((card, index) => {
        if (index < cardAmount * 2) {
            card.style.display = 'block';
            card.addEventListener('click', flipCard);
        } else {
            card.style.display = 'none';
        }

        card.style.width = cardWidth;
        card.style.height = cardHeight;

        if (remainingCards !== 0 && index >= totalCards - remainingCards) {
            card.style.marginLeft = `calc((100% - ${cardsPerRow} * (${cardWidth} + 20px)) / 2)`;
        } else {
            card.style.marginLeft = '';
        }
    });



    resetBoard();
    shuffle();
}

function flipCard() {
    if (lockBoard) return;
    if (this.classList.contains('flip')) return; // Prevent selecting the same card twice

    this.classList.add('flip');
    document.getElementById('sound-flip').volume = 1;
    document.getElementById('sound-flip').play();
    if (!hasFlippedCard) {
        // first click
        hasFlippedCard = true;
        firstCard = this;
    } else {
        // second click
        hasFlippedCard = false;
        secondCard = this;
        checkForMatched();
    }
}
function checkForMatched() {
    if (firstCard.dataset.framework === secondCard.dataset.framework) {
        //cards are matched
        disableCards();
    } else {
        //not a match
        unflipCards();
    }
}

function disableCards() {
    restartCounter = restartCounter - 1;
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    checkEndGame();
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        lockBoard = false;
    }, 650);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];

}

function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 60);
        card.style.order = randomPos;
    });
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 10);
    startButton.removeEventListener('click', startGame);
}

function updateTimer() {
    const currentTime = (Date.now() - startTime) / 1000; // Time in seconds
    const seconds = Math.floor(currentTime);
    timerElement.textContent = `Time: ${seconds}`;
}


function displayPlayerName(playerName) {
    playerNameElement.style.display = 'block';
    playerNameElement.textContent = `Player: ${playerName}`;
}
function enableDisplayPlayerName(playerName) {
    playerNameElement.style.display = 'block';
}
function disableDisplayPlayerName(playerName) {
    playerNameElement.style.display = 'none';
}

function displayTimer() {
    timerElement.style.display = 'block';
}

function isNumberValid(cardAmount) {
    if (isNaN(cardAmount) || cardAmount < 2 || cardAmount > 30) {
        return 1;
    }
    return 0;
}

function isNameValid(playerName) {
    if (playerName.length < 2 || playerName.length > 30) {
        return 2;
    }
    return 0;
}

function checkEndGame() {
    const matchedCards = document.querySelectorAll('.flip');
    if (restartCounter === 0) {
        restartButton.style.display = 'block';
        endGame(); // Call the endGame function if all cards are matched
    }
}
let messageContainer;
function endGame() {
    disableDisplayPlayerName(playerName);
    clearInterval(timerInterval); // Stop the timer

    // Get the time and number of cards
    const time = timerElement.textContent.replace('Time: ', '');
    const numCards = cardAmount * 2;
    const name = playerName.value;

    // Hide the cards
    cards.forEach(card => {
        card.style.display = 'none';
    });

    // Remove the previous message container if it exists
    if (messageContainer) {
        messageContainer.remove();
    }

    // Create the message container
    messageContainer = document.createElement('div');
    messageContainer.id = 'end-game-message';

    // Create the message element
    const nameMessageElement = document.createElement('p');
    nameMessageElement.textContent = `Congratulations ${name}!,`;
    nameMessageElement.style.textAlign = "center";
    const infoMessageElement = document.createElement('p');
    infoMessageElement.textContent = `You completed the game in ${time} seconds with ${numCards} cards.`;
    infoMessageElement.style.textAlign = "center";
    infoMessageElement.style.fontSize = "20px";

    // Append the message elements to the container
    messageContainer.appendChild(nameMessageElement);
    messageContainer.appendChild(infoMessageElement);

    // Append the container to the document body or a specific container element
    document.body.appendChild(messageContainer);

    // Hide the timer element
    timerElement.style.display = 'none';
    stopGame.style.display = 'none';

}


function restartGame() {
    displayPlayerName(playerName);
    if (messageContainer) {
        messageContainer.remove();
        messageContainer = null;
    }
    restartButton.style.display = 'none';
    restartCounter = cardAmount; // Reset restartCounter
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove('flip');
    }
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', flipCard);
    }
    resetBoard();
    shuffle();
    startGame();

}
//button exit game
function exitGame() {
    if (messageContainer) {
        messageContainer.remove();
        messageContainer = null;
    }
    for (let i = 0; i < cards.length; i++) {
        cards[i].style.display = 'none';
        cards[i].classList.remove('flip');
    }
    startButton.style.display = 'block';
    stopGame.style.display = 'none';
    // Reset the game state
    resetBoard();

    timerElement.style.display = 'none';
    // Show the input form
    inputContainer.style.display = 'block';

    // Stop the timer
    clearInterval(timerInterval);

    // Hide the restart button
    restartButton.style.display = 'none';
    disableDisplayPlayerName(playerName);
    nameDisable = true;

}


function removeMessage() {
    //remove finshing message
    if (messageContainer && messageContainer.parentNode) {
        messageContainer.parentNode.removeChild(messageContainer);
    }
}
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
stopGame.addEventListener('click', exitGame);

