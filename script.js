// Timer set to 2 minutes (120,000 milliseconds)
const countDownTime = 2 * 60 * 1000;
const countDownDate = new Date().getTime() + countDownTime;

// Start countdown timer
const timer = setInterval(function() {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = `Time Left: ${minutes}m ${seconds}s`;

    if (distance < 0) {
        clearInterval(timer);
        document.getElementById("countdown").innerHTML = "Time is up!";
        submitQuiz();  // Auto-submit when timer ends
    }
}, 1000);

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVEMqQEwLmpzCwGQdQdQOfuc1CLceg7TX4M",
    authDomain: "herman-e5894.firebaseapp.com",
    databaseURL: "https://herman-e5894-default-rtdb.firebaseio.com",
    projectId: "herman-e5894",
    storageBucket: "herman-e5894.appspot.com",
    messagingSenderId: "17968105226",
    appId: "1:17968105226:web:d7c2852d574327495a1cf3"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Correct Answers
const correctAnswers = {
    q1: "d",
    q2: "c"
};

// Function to submit the quiz
function submitQuiz() {
    if (document.getElementById("quizForm").style.display === "none") return; // Prevent multiple submissions

    let studentName = document.getElementById("studentName").value || "Anonymous";
    let q1 = document.querySelector('input[name="q1"]:checked');
    let q2 = document.querySelector('input[name="q2"]:checked');

    let answers = {
        name: studentName,
        q1: q1 ? q1.value : "No Answer",
        q2: q2 ? q2.value : "No Answer",
        timestamp: new Date().toISOString()
    };

    let score = 0;
    if (answers.q1 === correctAnswers.q1) score++;
    if (answers.q2 === correctAnswers.q2) score++;

    let grade = score === 2 ? "A" : score === 1 ? "B" : "F";

    answers.score = score;
    answers.grade = grade;

    // Save results to Firebase
    database.ref("quizResults").push(answers)
        .then(() => {
            document.getElementById("quizForm").style.display = "none";
            document.getElementById("result").innerHTML = `
                <h3>Quiz Submitted!</h3>
                <p>Name: ${studentName}</p>
                <p>Score: ${score}/2</p>
                <p>Grade: ${grade}</p>
            `;
        })
        .catch(error => console.error("Error saving to database:", error));
}

// Event listener for manual form submission
document.getElementById("quizForm").addEventListener("submit", function(event) {
    event.preventDefault();
    submitQuiz();
    clearInterval(timer);  // Stop timer when manually submitted
});
