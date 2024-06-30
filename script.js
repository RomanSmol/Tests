document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const nextButton = document.getElementById('next-btn');
    const confirmButton = document.getElementById('confirm-btn');
    const scoreContainer = document.getElementById('score-container');
    const scoreElement = document.getElementById('score');
    const restartButton = document.getElementById('restart-btn');
    const questionCounterElement = document.getElementById('question-counter');
    const multipleAnswerNote = document.getElementById('multiple-answer-note');
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const timerElement = document.getElementById('timer');

    let currentQuestionIndex = 0;
    let score = 0;
    let answered = false;
    let selectedAnswers = [];
    let timer;
    let timeLeft = 20;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }

    themeToggleButton.addEventListener('click', toggleTheme);

    nextButton.addEventListener('click', () => {
        if (answered) {
            currentQuestionIndex++;
            if (currentQuestionIndex < QUESTIONS.length) {
                setNextQuestion();
            } else {
                showScore();
            }
        }
    });

    confirmButton.addEventListener('click', () => {
        if (!answered && selectedAnswers.length > 0) {
            clearInterval(timer);
            checkAnswer();
        }
    });

    restartButton.addEventListener('click', restartQuiz);

    function toggleTheme() {
        document.body.classList.toggle('dark');
        const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    }

    function setNextQuestion() {
        resetState();
        showQuestion(QUESTIONS[currentQuestionIndex]);
        updateQuestionCounter();
        startTimer();
    }

    function showQuestion(question) {
        questionElement.innerText = question.question;
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            button.addEventListener('click', () => selectAnswer(button, answer));
            answerButtonsElement.appendChild(button);
        });
        if (question.multiple) {
            confirmButton.style.display = 'inline-block';
            multipleAnswerNote.style.display = 'block';
        } else {
            confirmButton.style.display = 'none';
            multipleAnswerNote.style.display = 'none';
        }
    }

    function selectAnswer(button, answer) {
        if (QUESTIONS[currentQuestionIndex].multiple) {
            if (selectedAnswers.includes(answer)) {
                selectedAnswers = selectedAnswers.filter(a => a !== answer);
                button.classList.remove('selected');
            } else {
                selectedAnswers.push(answer);
                button.classList.add('selected');
            }
        } else {
            selectedAnswers = [answer];
            Array.from(answerButtonsElement.children).forEach(btn => {
                btn.classList.remove('selected');
            });
            button.classList.add('selected');
            clearInterval(timer);
            checkAnswer();
        }
    }

    function checkAnswer() {
        answered = true;
        const question = QUESTIONS[currentQuestionIndex];
        question.answers.forEach(answer => {
            const button = Array.from(answerButtonsElement.children).find(btn => btn.innerText === answer.text);
            if (selectedAnswers.includes(answer)) {
                button.classList.add(answer.correct ? 'correct' : 'wrong');
            } else if (answer.correct) {
                button.classList.add('correct');
            }
            button.disabled = true;
        });

        if (selectedAnswers.every(answer => answer.correct) && selectedAnswers.length === question.answers.filter(a => a.correct).length) {
            score++;
        }

        if (currentQuestionIndex < QUESTIONS.length - 1) {
            nextButton.style.display = 'inline-block';
        } else {
            showScore();
        }
    }

    function updateQuestionCounter() {
        questionCounterElement.innerText = `Question ${currentQuestionIndex + 1} of ${QUESTIONS.length}`;
    }

    function showScore() {
        questionElement.style.display = 'none';
        answerButtonsElement.style.display = 'none';
        nextButton.style.display = 'none';
        confirmButton.style.display = 'none';
        multipleAnswerNote.style.display = 'none';
        scoreContainer.style.display = 'block';
        scoreElement.innerText = `You scored ${score} out of ${QUESTIONS.length}`;
    }

    function restartQuiz() {
        score = 0;
        currentQuestionIndex = 0;
        scoreContainer.style.display = 'none';
        questionElement.style.display = 'block';
        answerButtonsElement.style.display = 'block';
        nextButton.style.display = 'none';
        setNextQuestion();
    }

    function resetState() {
        clearInterval(timer);
        timeLeft = 20;
        timerElement.innerText = `${timeLeft}s`;
        nextButton.style.display = 'none';
        confirmButton.style.display = 'none';
        multipleAnswerNote.style.display = 'none';
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
        answered = false;
        selectedAnswers = [];
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            timerElement.innerText = `${timeLeft}s`;
            if (timeLeft === 0) {
                clearInterval(timer);
                alert('Time is up! Moving to the next question.');
                if (!answered) {
                    if (QUESTIONS[currentQuestionIndex].multiple) {
                        confirmButton.click();
                    } else {
                        checkAnswer();
                    }
                }
                if (currentQuestionIndex < QUESTIONS.length - 1) {
                    currentQuestionIndex++;
                    setNextQuestion();
                } else {
                    showScore();
                }
            }
        }, 1000);
    }

    setNextQuestion();
});