// slelect Elements
let countSpan = document.querySelector(".quiz-app .quiz-info .count span");

let bulletsSpanContainer = document.querySelector(".bullets .spans");

let quizArea = document.querySelector(".quiz-area");

let answersArea = document.querySelector(".answers-area");

let submitButton = document.querySelector(".submit-button");

let bullets = document.querySelector(" .bullets");

let resultsContainer = document.querySelector(".results");

let countdownElement = document.querySelector(".countdown");

//set options

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

// GET Questions

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {
            //change json object to js object//
            let questionsObject = JSON.parse(this.responseText);
            let qcount = questionsObject.length;
            console.log(questionsObject)
            //creat bullets + set questions count

            creatBullets(qcount)

            // Add Questions Data
            addQuestionDate(questionsObject[currentIndex], qcount);

            //start countdown
            countdown(5,qcount);

            // click on submit
            submitButton.onclick = () => {

                //Get right Answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                //increase index
                currentIndex++;

                //check the answer
                checkeAnswer(theRightAnswer, qcount);

                //Remove Previous Question
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";

                // Add Questions Data
                addQuestionDate(questionsObject[currentIndex], qcount);

                // Handle Bullets Classes

                handleBullets();

                //start countdown
                clearInterval(countdownInterval);
                countdown(5,qcount);

                //Show Results
                showResults(qcount);

            };

        }
    }

    myRequest.open("GET", "html_questions.json", true);
    myRequest.send();
}

getQuestions();

// Creat Bullets

function creatBullets (num) {
    countSpan.innerHTML = num;

    //creat Spans

    for (let i = 0; i < num; i++) {

        //Creat Bullet
        let theBullet = document.createElement("span");

        // color the active bullet

        if(i === 0) {
            theBullet.className = "on";
        }

        //Append Bullets To Main Bullet Container
        bulletsSpanContainer.appendChild(theBullet);

    }
}

function addQuestionDate(obj, count) {
   if (currentIndex < count) {
        //creat question h2 title
    let questionTitle = document.createElement("h2");

    // creat question text
    let questionText = document.createTextNode(obj.title);
    // Append text to h2

    questionTitle.appendChild(questionText);

    //Append h2 to quiz area

    quizArea.appendChild(questionTitle);

    // create the answers

    for (let i = 1; i <= 4; i++) {
        //create main Answers div

        let mainDive = document.createElement("div");

        //Add class to main div

        mainDive.className = 'answer';

        //creat radio input

        let radioInput = document.createElement("input");

        //Add type + name + id + data
        radioInput.type = "radio";
        radioInput.name = "question";
        radioInput.id = `answer_${i}` ;
        radioInput.dataset.answer = obj[`answer_${i}`];

        // Make First Option Checked

        if(i === 1) {
            radioInput.checked = true;
        }

        //creat Lable
        let theLabel = document.createElement("label");

        //Add for label

        theLabel.htmlFor = `answer_${i}` ;

        //creat label text

        let theLabelText = document.createTextNode(obj[`answer_${i}`]);

        //Add the text to label

        theLabel.appendChild(theLabelText);
        
        //Add input + label to main div 

        mainDive.appendChild(radioInput);
        mainDive.appendChild(theLabel);

        answersArea.appendChild(mainDive);


    }
   }

}

function checkeAnswer (rAnswe, count) {
    console.log(rAnswe,count);
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        
        if (answers[i].checked) {

            theChoosenAnswer = answers[i].dataset.answer;
        }
    }


    if (rAnswe === theChoosenAnswer) {
        rightAnswers++;
    }
}

function handleBullets() {

    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);

    arrayOfSpans.forEach((span, index) => {

        if (currentIndex === index) {
            span.className = "on";
        }
    

    });

}

function showResults(count) {
    let theResults;
    if(currentIndex === count){
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class="good">good answer</span>, ${rightAnswers} from ${count}`;
        } else if (rightAnswers === count) {
            theResults = `<span class="good">Excellent</span>`;
        } else {
            theResults = `<span class="bad">bad answer</span>, ${rightAnswers} from ${count}`;
        }

        resultsContainer.innerHTML = theResults;
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "20px";
        resultsContainer.style.padding= "20px";

    }
}

function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            // short if condition
            minutes = minutes < 10 ? `0${minutes}`: minutes;
            seconds = seconds < 10 ? `0${seconds}`: seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.onclick();
            }
             
        }, 1000)
    }
}