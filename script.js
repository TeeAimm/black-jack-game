// Rock Paper scissor game starts

function rpsGame(yourChoice) {
    var humanChoice = yourChoice.id;
    var botChoice = rpsOption(setComputerOptions());
    console.log("You choose -> " + humanChoice + "   Computer choice -> " + botChoice);

    var results = decideWinner(humanChoice, botChoice);
    //console.log("decideWinner" + results);

    var h1 = document.createElement('h1');

    showWinner(results);
    console.log(showWinner(results));
}

function setComputerOptions() {
    return Math.floor(Math.random() * 3);
}

function rpsOption(number) {
    var gameOptions = ['rock', 'paper', 'scissor'];
    return gameOptions[number];
}

function decideWinner(urChoice, comChoice) {
    var rpsScore = {
        'rock': { 'rock': 0.5, 'paper': 0, 'scissor': 1 },
        'paper': { 'rock': 1, 'paper': 0.5, 'scissor': 0 },
        'scissor': { 'rock': 0, 'paper': 1, 'scissor': 0.5 }
    }
    var yourScore = rpsScore[urChoice][comChoice];
    var comScore = rpsScore[comChoice][urChoice];

    return [yourScore, comScore];
}

function showWinner([urChoice, comChoice]) {
    if (urChoice === 1) {
        return 'You won';
    }
    else if (urChoice === 0.5) {
        return 'match Tie';
    }
    else {
        return 'Computer won';
    }
}

// Rock Paper scissor game ends

// Change button color game starts
var allButtons = document.getElementsByTagName('button');
//console.log(allButtons);
var copyAllButtons = [];
var copyAllButtonsTwo = [];
for (let i = 0; i < allButtons.length; i++) {
    copyAllButtons.push(allButtons[i].classList[1]);
    copyAllButtonsTwo.push(allButtons[i].classList[1]);
}
console.log("ghvg ->", copyAllButtons);
function buttonColorChange(color) {
    if (color.value == 'red') {
        buttonRed();
    }
    if (color.value == 'green') {
        buttonGreen();
    }
    if (color.value == 'reset') {
        buttonReset();
    }
    if (color.value == 'random') {
        buttonRandom();
    }
}

function buttonRed() {
    for (let i = 0; i < allButtons.length; i++) {
        allButtons[i].classList.remove(allButtons[i].classList[1]);
        allButtons[i].classList.add('btn-danger');
    }
}

function buttonGreen() {
    for (let i = 0; i < allButtons.length; i++) {
        allButtons[i].classList.remove(allButtons[i].classList[1]);
        allButtons[i].classList.add('btn-success');
    }
}

function buttonReset() {
    for (let i = 0; i < allButtons.length; i++) {
        allButtons[i].classList.remove(allButtons[i].classList[1]);
        allButtons[i].classList.add(copyAllButtons[i]);
    }
}

function buttonRandom() {
    for (let i = 0; i < allButtons.length; i++) {
        allButtons[i].classList.remove(allButtons[i].classList[1]);
        allButtons[i].classList.add(copyAllButtons[Math.floor(Math.random() * 4)]);
    }
}
// Change button color game ends


// Game Blackjack starts
document.querySelector('#hitBtn').addEventListener('click', hitFunction);
document.querySelector('#standBtn').addEventListener('click', standFunction);
document.querySelector('#dealBtn').addEventListener('click', dealFunction);

let blackJackData = {
    'you': { 'spanId': '#yourScore', 'div': '#yourBox', 'score': 0 },
    'dealer': { 'spanId': '#dealerScore', 'div': '#dealerBox', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'K', 'Q'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'A': [1, 11], 'J': 10, 'K': 10, 'Q': 10 },
    'wins': 0,
    'losses': 0,
    'draw': 0,
    'isStand': false,
    'isTurnOver': false,
}

const YOU = blackJackData['you'];
const DEALER = blackJackData['dealer'];
const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');

function hitFunction() {
    if (blackJackData['isStand'] === false) {
        console.log('Hit me!');
        let cards = randomCardINdex();
        showCard(cards, YOU);
        updatePlayerScore(cards, YOU);
        showPlayerScore(YOU);
    }
}

function randomCardINdex() {
    var cardIndex = Math.floor(Math.random() * 13);
    return blackJackData['cards'][cardIndex];
}

function sleep(ms){
    return new Promise(recover => setTimeout(recover, ms));
}

async function standFunction() {
    blackJackData['isStand'] = true;
    console.log('Stand btn clicked!');

    while (DEALER['score'] < 16) {
        let cards = randomCardINdex();
        showCard(cards, DEALER);
        updatePlayerScore(cards, DEALER);
        showPlayerScore(DEALER);
        await sleep(1000);
    }
    blackJackData['isTurnOver'] = true;
    let winner = computeWinner();
    showBlackJackWinner(winner);
}

function dealFunction() {
    if (blackJackData['isTurnOver']) {
        blackJackData['isStand'] = false;
        blackJackData['isTurnOver'] = false;
        console.log('deal btn pressed');
        let hitImages = document.querySelector('#yourBox').querySelectorAll('img');
        for (let i = 0; i < hitImages.length; i++) {
            hitImages[i].remove();
        }

        let dealerImages = document.querySelector('#dealerBox').querySelectorAll('img');
        for (let i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#yourScore').textContent = 0;
        document.querySelector('#dealerScore').textContent = 0;

        document.querySelector('#yourScore').style.color = "white";
        document.querySelector('#dealerScore').style.color = "white";

        document.querySelector('#letsPlay').textContent = "Let's play";
        document.querySelector('#letsPlay').style.color = "Black";
    }
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] < 22) {
        let cardImage = document.createElement('img');
        cardImage.src = `images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        playHitSound();
    }
}

function playHitSound() {
    return hitSound.play();
}

function updatePlayerScore(card, activePlayer) {
    // If adding 11 keeps me below 21, add 11,else add 1
    if (card === 'A') {
        if (activePlayer["score"] + blackJackData["cardsMap"][card][1] <= 21) {
            return activePlayer["score"] += blackJackData["cardsMap"][card][1];
        }
        else {
            return activePlayer["score"] += blackJackData["cardsMap"][card][0];
        }
    }
    else {
        var score = blackJackData['cardsMap'][card];
        return activePlayer["score"] += score;
    }
}

function showPlayerScore(activePlayer) {
    if (activePlayer['score'] >= 22) {
        document.querySelector(activePlayer['spanId']).textContent = "Bust";
        document.querySelector(activePlayer['spanId']).style.color = "red";
    }
    else {
        document.querySelector(activePlayer['spanId']).textContent = activePlayer['score'];
    }
    //return document.querySelector(activePlayer['spanId']).textContent = activePlayer['score'];
}

function computeWinner() {
    console.log('Compute logic!');
    let winner;
    // Your score is higher than dealer or when dealer busts but you're less than 21
    if (YOU['score'] <= 21) {
        if ((YOU['score'] > DEALER['score']) || (DEALER['score'] > 21)) {
            console.log('You won!');
            winner = YOU;
            //winner = 'You won!';
        }
        else if (YOU['score'] < DEALER['score']) {
            console.log('You lost!');
            winner = DEALER;
            //winner = 'You lost!';
        }
        else if (YOU['score'] === DEALER['score']) {
            console.log('You drew!');
            //winner = 'You drew!';
        }
    }
    else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        console.log('You lost!');
        winner = DEALER;
        //winner = 'You lost!';
    }
    else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        console.log('you drew!');
        //winner = 'You drew!';
    }
    console.log('winner ->', winner);
    return winner;
}

function showBlackJackWinner(winner) {
    if (blackJackData['isTurnOver']) {
        let message, messageColor;
        if (winner === YOU) {
            message = 'You won';
            messageColor = 'Green'
            winSound.play();
            blackJackData['wins']++;
        }
        else if (winner === DEALER) {
            message = 'You lost';
            messageColor = 'Red';
            lossSound.play();
            blackJackData['losses']++;
        }
        else {
            message = 'You drew';
            messageColor = 'Yellow';
            blackJackData['draw']++;
        }

        //document.querySelector('#letsPlay').remove();
        document.querySelector('#letsPlay').textContent = message;
        document.querySelector('#letsPlay').style.color = messageColor;

        //Fill table data
        document.querySelector('#wins').textContent = blackJackData['wins'];
        document.querySelector('#losses').textContent = blackJackData['losses'];
        document.querySelector('#draw').textContent = blackJackData['draw'];
    }
}

