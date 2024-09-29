// Memory Game Logic
const gameContainer = document.querySelector('.game');
const resetButton = document.querySelector('.reset');
const congratsMessage = document.getElementById('congrats-message');
const levelSelector = document.getElementById('level-selector');
let cards = [];
let flippedCards = [];
let matchedCards = [];

const allCards = ['🀄', '🀄', '🌂', '🌂', '🍀', '🍀', '😂', '😂', '⛈️', '⛈️', '🏀', '🏀', '☄️', '☄️', '🤓', '🤓'];

// Shuffle function to randomize the cards
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Create the card elements based on level
function createCards(level) {
    matchedCards = [];
    flippedCards = [];
    congratsMessage.style.display = 'none'; // Hide the congratulation message

    let numPairs;
    switch(level) {
        case 'easy':
            numPairs = 4; // 4 pairs for easy level
            break;
        case 'medium':
            numPairs = 6; // 6 pairs for medium level
            break;
        case 'hard':
            numPairs = 8; // 8 pairs for hard level
            break;
    }

    // Timer logic
    let timeLeft = 30 * 60; // 30 minutes in seconds
    const timerDisplay = document.getElementById('timer');
    const countdown = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(countdown);
            document.getElementById('losePopup').classList.remove('hidden');
        }
    }, 1000);

    // Select cards based on the number of pairs
    cards = shuffle(allCards.slice(0, numPairs * 2));

    // Generate the card grid
    gameContainer.innerHTML = '';
    gameContainer.style.gridTemplateColumns = `repeat(${Math.min(4, numPairs)}, 1fr)`;
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.innerText = card;
        cardElement.addEventListener('click', handleCardClick);
        gameContainer.appendChild(cardElement);
    });
}

// Handle the card click event
function handleCardClick(e) {
    const clickedCard = e.target;

    // Prevent further clicks if two cards are already flipped or if the clicked card is already flipped
    if (flippedCards.length === 2 || clickedCard.classList.contains('flipped')) return;

    // Add the 'flipped' class to show the content of the card
    clickedCard.classList.add('flipped');
    flippedCards.push(clickedCard);

    // If two cards are flipped, check if they match
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

// Check if the two flipped cards match
function checkMatch() {
    const [card1, card2] = flippedCards;

    // If the cards match, keep them flipped
    if (card1.innerText === card2.innerText) {
        matchedCards.push(card1, card2);
        flippedCards = [];

        // Check if all cards are matched
        if (matchedCards.length === cards.length) {
            congratsMessage.style.display = 'block'; // Show congratulations
        }
    } else {
        // If they don't match, flip them back over after a short delay
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// Event listener for the reset button
resetButton.addEventListener('click', () => {
    const selectedLevel = levelSelector.value; // Get the selected level
    createCards(selectedLevel); // Create the game based on the level
});

// Event listener for level change
levelSelector.addEventListener('change', () => {
    const selectedLevel = levelSelector.value;
    createCards(selectedLevel); // Reset the game whenever the level is changed
});

// Initialize the game with the default level (easy)
createCards('easy');

// Favourite Button Functionality
const favouriteButton = document.getElementById('favourite-button');
let isFavorited = false;

favouriteButton.addEventListener('click', () => {
    isFavorited = !isFavorited;
    favouriteButton.textContent = isFavorited ? 'Unfavourite' : 'Favourite';
});

// Star rating functionality
const stars = document.querySelectorAll('.star');
const ratingValue = document.getElementById('rating-value');

// Reset the stars to default (unselected) color
function resetStars() {
    stars.forEach(star => {
        star.classList.remove('selected'); // Remove 'selected' class
    });
}

stars.forEach(star => {
    star.addEventListener('click', () => {
        const value = star.getAttribute('data-value');
        ratingValue.textContent = `Your Rating: ${value}`;
        
        // Reset all stars first
        resetStars();
        
        // Apply 'selected' class to all stars up to and including the clicked star
        stars.forEach(s => {
            if (s.getAttribute('data-value') <= value) {
                s.classList.add('selected');
            }
        });
    });
});
