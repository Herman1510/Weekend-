// Timer configuration (2 minutes)
const countDownTime = 2 * 60 * 1000;
let countDownDate = new Date().getTime() + countDownTime;
let timer;
let isSubmitted = false; // Prevent multiple submissions

// Start countdown timer
function startTimer() {
    updateTimerDisplay();
    timer = setInterval(updateTimerDisplay, 1000);
}

function updateTimerDisplay() {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = Math.max(0, Math.floor((distance % (1000 * 60)) / 1000));

    document.getElementById("countdown").innerHTML = `Time Left: ${minutes}m ${seconds}s`;

    if (distance < 0) {
        clearInterval(timer);
        document.getElementById("countdown").innerHTML = "Time is up!";
        if (!isSubmitted) submitQuiz();
    }
}

// Firebase Configuration (YOUR CONFIG INCLUDED)
const firebaseConfig = {
    apiKey: "AIzaSyBVEMqQEwLmpzCwGQdQOfuc1CLceg7TX4M",
    authDomain: "herman-e5894.firebaseapp.com",
    databaseURL: "https://herman-e5894-default-rtdb.firebaseio.com",
    projectId: "herman-e5894",
    storageBucket: "herman-e5894.appspot.com",
    messagingSenderId: "17968105226",
    appId: "1:17968105226:web:d7c2852d574327495a1cf3",
    measurementId: "G-06YG1L3YWT"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Correct Answers
const correctAnswers = { q1: "d", q2: "c" };

// Submit quiz function
function submitQuiz() {
    if (isSubmitted) return;
    isSubmitted = true;
    clearInterval(timer);

    const studentName = document.getElementById("studentName").value || "Anonymous";
    const answers = {
        name: studentName,
        q1: getSelectedValue('q1'),
        q2: getSelectedValue('q2'),
        timestamp: new Date().toISOString()
    };

    const score = calculateScore(answers);
    const grade = getGrade(score);

    saveResults({ ...answers, score, grade });
    displayResults(studentName, score, grade);
    hideQuizForm();
}

// Helper functions
function getSelectedValue(questionName) {
    const selected = document.querySelector(`input[name="${questionName}"]:checked`);
    return selected ? selected.value : "No Answer";
}

function calculateScore(answers) {
    return ['q1', 'q2'].reduce((acc, q) => acc + (answers[q] === correctAnswers[q] ? 1 : 0), 0);
}

function getGrade(score) {
    return score === 2 ? "A" : score === 1 ? "B" : "F";
}

function saveResults(results) {
    database.ref("quizResults").push(results)
        .catch(error => console.error("Error saving to database:", error));
}

function displayResults(name, score, grade) {
    document.getElementById("result").innerHTML = `
        <h3>Quiz Submitted!</h3>
        <p>Name: ${name}</p>
        <p>Score: ${score}/2</p>
        <p>Grade: ${grade}</p>
    `;
}

function hideQuizForm() {
    document.getElementById("quizForm").style.display = "none";
}

// Event listeners
document.getElementById("quizForm").addEventListener("submit", function(event) {
    event.preventDefault();
    submitQuiz();
});

// Initialize timer when page loads
startTimer();
