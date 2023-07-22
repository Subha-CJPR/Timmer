let timers = [];
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const addTimerButton = document.getElementById('add-timer');
const currentTimersButton = document.getElementById('current-timers');

function startTimer(seconds, timerIndex) {
  clearInterval(timers[timerIndex].countdown);

  const now = Date.now();
  const then = now + seconds * 1000;

  displayTimeLeft(seconds, timerIndex);

  timers[timerIndex].countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    if (secondsLeft < 0) {
      clearInterval(timers[timerIndex].countdown);
      removeTimer(timerIndex);
      return;
    }

    displayTimeLeft(secondsLeft, timerIndex);
  }, 1000);
}

function displayTimeLeft(seconds, timerIndex) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsRemaining = seconds % 60;

  const timerCard = timers[timerIndex].card;
  const timeDisplay = timerCard.querySelector('.timer-display');
  const timesUpDisplay = timerCard.querySelector('.times-up-display');

  if (seconds <= 0) {
    timeDisplay.style.display = 'none';
    timesUpDisplay.style.display = 'block';
  } else {
    timeDisplay.style.display = 'block';
    timesUpDisplay.style.display = 'none';
    timeDisplay.querySelector('.hours-display').textContent = String(hours).padStart(2, '0');
    timeDisplay.querySelector('.minutes-display').textContent = String(minutes).padStart(2, '0');
    timeDisplay.querySelector('.seconds-display').textContent = String(secondsRemaining).padStart(2, '0');
  }
}

function createTimerCard(timerIndex) {
  const timerCard = document.createElement('div');
  timerCard.className = 'timer-card';
  timerCard.innerHTML = `
    <div class="timer-display">
      <span class="hours-display">00</span> :
      <span class="minutes-display">00</span> :
      <span class="seconds-display">00</span>
    </div>
    <div class="times-up-display">Time's UP!</div>
    <button class="delete-timer">Delete</button>
  `;

  const deleteButton = timerCard.querySelector('.delete-timer');

  deleteButton.addEventListener('click', () => {
    removeTimer(timerIndex);
  });

  timers[timerIndex].card = timerCard;

  return timerCard;
}

function removeTimer(timerIndex) {
  clearInterval(timers[timerIndex].countdown);
  timers.splice(timerIndex, 1);
  updateTimerList();
}

function updateTimerList() {
  const timerList = document.querySelector('.timer-list');
  timerList.innerHTML = '';

  timers.forEach((timer, index) => {
    const timerCard = createTimerCard(index);
    timerList.appendChild(timerCard);
    startTimer(timer.totalSeconds, index);
  });
}

addTimerButton.addEventListener('click', () => {
  const hours = parseInt(hoursInput.value);
  const minutes = parseInt(minutesInput.value);
  const seconds = parseInt(secondsInput.value);

  if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    timers.push({ totalSeconds, countdown: null });
    updateTimerList();
  } else {
    alert('Invalid input. Please enter valid numeric values.');
  }
});

currentTimersButton.addEventListener('click', () => {
  updateTimerList();
});

// Automatically start timers and update display
function startAllTimers() {
  timers.forEach((timer, index) => {
    const now = Date.now();
    timer.then = now + timer.totalSeconds * 1000;
    startTimer(timer.totalSeconds, index);
  });
}

startAllTimers();
