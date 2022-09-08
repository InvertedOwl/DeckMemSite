

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
            console.log("Saved: " + element);
            let data = JSON.parse(localStorage.getItem("cards"))[element];
            document.getElementById("cardList").innerHTML += `
            <li id="${element}">
                <p style="margin: 2px;"><img src="/static/cards/${element}" style="width: 20px; vertical-align: middle">  ${data.person} || ${data.verb} || ${data.thing}</p>
            </li>`;
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
        document.getElementById("cardList").innerHTML += `
    <li id="${Object.keys(cardData)[cardIndex]}">
        <p style="margin: 2px;"><img src="/static/cards/${Object.keys(cardData)[cardIndex]}" style="width: 20px; vertical-align: middle">  ${data.person} || ${data.verb} || ${data.thing}</p>
    </li>`;

    } else {
        document.getElementById(Object.keys(cardData)[cardIndex]).innerHTML = `        <p style="margin: 2px;"><img src="/static/cards/${Object.keys(cardData)[cardIndex]}" style="width: 20px; vertical-align: middle">  ${savedCard[Object.keys(cardData)[cardIndex]].person} || ${savedCard[Object.keys(cardData)[cardIndex]].verb} || ${savedCard[Object.keys(cardData)[cardIndex]].thing}</p>
        `
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
    newQuestion();
}

let correctId = 0;

function newQuestion() {
    for (let i = 0; i < 4; i++) {
        document.getElementById(i + "choice").src = `/static/cards/${Object.keys(savedCard)[Math.floor(Math.random() * Object.keys(savedCard).length)]}`;
        document.getElementById(i + "choice").parentElement.removeAttribute("class");

    }


    let randCard = Object.keys(savedCard)[Math.floor(Math.random() * Object.keys(savedCard).length)];
    let randItem = savedCard[randCard][Object.keys(savedCard[randCard])[Math.floor(Math.random() * Object.keys(savedCard[randCard]).length)]]

    document.getElementById("question").innerHTML = `Which card is assosiated with the phrase <span style="color: rgb(134, 134, 220);">${randItem}</span>`

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


// TODO
// . Randomly pick card and save the index
// . Pick element of card
// . Pick 3 other random cards
// . Put them all as buttons randomly
// . On click for all buttons and special effect for right button
// . Redo