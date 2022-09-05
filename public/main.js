

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