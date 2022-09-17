

let cardData = {};
let savedCard = {};
let cardImg = document.getElementById("cardImg");
let personInput = document.getElementById("person")
let verbInput = document.getElementById("verb")
let thingInput = document.getElementById("thing")
let cardIndex = 0;

fetch("/static/cards.json").then(response => response.json()).then((json) => {
    cardData = json;
    cardImg.src = "/static/cards/" + Object.keys(cardData)[0];

    if (localStorage.getItem("cards") != undefined) {
        savedCard = JSON.parse(localStorage.getItem("cards"));
        if (Object.keys(JSON.parse(localStorage.getItem("cards"))).length == 52) {
            document.getElementById("rehersal-button").style.display = "block";
        }
        Object.keys(JSON.parse(localStorage.getItem("cards"))).forEach(element => {
            console.log("index: " + Object.keys(JSON.parse(localStorage.getItem("cards"))).indexOf(element));
            let data = JSON.parse(localStorage.getItem("cards"))[element];

            if (Object.keys(JSON.parse(localStorage.getItem("cards"))).indexOf(element) > 25) {
                document.getElementById("cardList2").innerHTML += `
                <li id="${element}" style="position: relative;">
                    <p style="margin: 2px; text-align: right;">  ${data.person} || ${data.verb} || ${data.thing} <img src="/static/cards/${element}" style="width: calc(60vh / 26); vertical-align: middle"></p>
                </li>`;
            } else {
                document.getElementById("cardList").innerHTML += `
                <li id="${element}">
                    <p style="margin: 2px;"><img src="/static/cards/${element}" style="width: calc(60vh / 26); vertical-align: middle">  ${data.person} || ${data.verb} || ${data.thing}</p>
                </li>`;
            }

        });
        personInput.value = JSON.parse(localStorage.getItem("cards"))[Object.keys(cardData)[cardIndex]].person;
        verbInput.value = JSON.parse(localStorage.getItem("cards"))[Object.keys(cardData)[cardIndex]].verb;
        thingInput.value = JSON.parse(localStorage.getItem("cards"))[Object.keys(cardData)[cardIndex]].thing;
    }

})




function nextCard() {

    if (personInput.value == "" || verbInput.value == "" || thingInput.value == "") {
        return;
    }

    let data = {"person" : personInput.value, "verb" : verbInput.value, "thing" : thingInput.value};
    personInput.value = "T";
    verbInput.value = "T";
    thingInput.value = "T";

    if (!savedCard[Object.keys(cardData)[cardIndex]]) {
        if (Object.keys(savedCard).length > 26) {
            document.getElementById("cardList2").innerHTML += `
            <li id="${Object.keys(cardData)[cardIndex]}" style="position: relative;">
                <p style="margin: 2px; text-align: right;">  ${data.person} || ${data.verb} || ${data.thing} <img src="/static/cards/${Object.keys(cardData)[cardIndex]}" style="width: calc(60vh / 26); vertical-align: middle"></p>
            </li>`;
        } else {
            document.getElementById("cardList").innerHTML += `
            <li id="${Object.keys(cardData)[cardIndex]}">
                <p style="margin: 2px;"><img src="/static/cards/${Object.keys(cardData)[cardIndex]}" style="width: calc(60vh / 26); vertical-align: middle">  ${data.person} || ${data.verb} || ${data.thing}</p>
            </li>`;
        }



    } else {
        if (cardIndex > 25) {
            document.getElementById(Object.keys(cardData)[cardIndex]).innerHTML = `        <p style="margin: 2px; text-align: right;">  ${data.person} || ${data.verb} || ${data.thing} <img src="/static/cards/${Object.keys(cardData)[cardIndex]}" style="width: calc(60vh / 26); vertical-align: middle"></p>
            `
        } else {
            document.getElementById(Object.keys(cardData)[cardIndex]).innerHTML = `         <p style="margin: 2px;"><img src="/static/cards/${Object.keys(cardData)[cardIndex]}" style="width: calc(60vh / 26); vertical-align: middle">  ${data.person} || ${data.verb} || ${data.thing}</p>

            `
        }

    }
    savedCard[Object.keys(cardData)[cardIndex]] = data;
    localStorage.setItem("cards", JSON.stringify(savedCard))

    if (cardIndex < 51) {
        cardIndex += 1;
        updateCard();
    } else {
        document.getElementById("rehersal-button").style.display = "block";
    }
    if (savedCard[Object.keys(cardData)[cardIndex]]) {
        personInput.value = savedCard[Object.keys(cardData)[cardIndex]].person;
        verbInput.value = savedCard[Object.keys(cardData)[cardIndex]].verb;
        thingInput.value = savedCard[Object.keys(cardData)[cardIndex]].thing;
    }

}
function lastCard() {
    if (cardIndex > 0) {
        cardIndex -= 1;
        updateCard();
    }

    personInput.value = JSON.parse(localStorage.getItem("cards"))[Object.keys(cardData)[cardIndex]].person;
    verbInput.value = JSON.parse(localStorage.getItem("cards"))[Object.keys(cardData)[cardIndex]].verb;
    thingInput.value = JSON.parse(localStorage.getItem("cards"))[Object.keys(cardData)[cardIndex]].thing;
}

function updateCard() {
    cardImg.src = "/static/cards/" + Object.keys(cardData)[cardIndex];
}

function randomize() {
    fetch("/static/names.json").then(response => response.json()).then((json) => {
        personInput.value = json.names[Math.floor(Math.random() * json.names.length)]
    })
}

function rehersal() {
    document.getElementById("Encoding").style.display = "none";
    document.getElementById("Rehearsal").style.display = "block";
    document.getElementById("Test").style.display = "none";
    newQuestion();
}
function encoding() {
    document.getElementById("Encoding").style.display = "block";
    document.getElementById("Rehearsal").style.display = "none";
    document.getElementById("Test").style.display = "none";
}

let testIndex;
let testArray;

function test() {
    document.getElementById("Encoding").style.display = "none";
    document.getElementById("Rehearsal").style.display = "none";
    document.getElementById("Test").style.display = "block";

    testIndex = 0;
    testArray = Object.keys(cardData);
    shuffleArray(testArray);
    console.log(testArray + " WOAH")

    updateTest();
}

let correctId = 0;

function newQuestion() {
    for (let i = 0; i < 4; i++) {
        document.getElementById(i + "choice").src = `/static/cards/${Object.keys(savedCard)[Math.floor(Math.random() * Object.keys(savedCard).length)]}`;
        document.getElementById(i + "choice").parentElement.removeAttribute("class");

    }


    let randCard = Object.keys(savedCard)[Math.floor(Math.random() * Object.keys(savedCard).length)];
    let randItem = savedCard[randCard][Object.keys(savedCard[randCard])[Math.floor(Math.random() * Object.keys(savedCard[randCard]).length)]]

    document.getElementById("question").innerHTML = `Which card is assosiated with the phrase <span style="color: rgb(228, 173, 100);">${randItem}</span>`

    console.log("Card: " + randCard + ", RandItem: " + randItem);

    correctId = Math.floor(Math.random() * 4);

    document.getElementById(correctId + "choice").src = `/static/cards/${randCard}`;
}

let correct = 0;
let total = 0;
let ontoNext = false;
function clicked(button) {
    for (let i = 0; i < 4; i++) {
        document.getElementById(i + "choice").parentElement.classList.add("wrong");
        
    }
    document.getElementById(correctId + "choice").parentElement.classList.add("right");

    if (correctId == button) {
        console.log("Correct!");
        correct += 1;
    }
    total += 1;
    ontoNext = !ontoNext

    document.getElementById("percent").innerHTML = Math.floor(((correct / total) * 100)) + "%"

    if (!ontoNext)
    newQuestion();
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}




function lastCardTest() {
    if (testIndex > 0) {
        testIndex -= 1;
    }
    updateTest();
}
function nextCardTest() {

    if (testIndex < 51) {
        testIndex += 1;
    }
    updateTest();
}

function updateTest() {
    document.getElementById("cardImgTest").src = "/static/cards/" + testArray[testIndex];
}
