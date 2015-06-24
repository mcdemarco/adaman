﻿//
// This file was created by Felbrigg Herriot and remixed by M. C. DeMarco, and is released under a Creative Commons Attribution NonCommercial ShareAlike 3.0 License
//

//
// Global Variables
//
var gameOVER = false;       // overall flag to indicate the game is over
var score = 0;
var debugOn = false;

//
// runs when the page first loads
//
function initialise_GamePage() {
    // set up the click events for the story popup
    $('#showStoryButton').click(function () {
        $('#whatsthestory').show();
    });
    $('#closeStoryButton').click(function () {
        $('#whatsthestory').hide();
    });
    $('#closeNoMoves').click(function () {
        $('#gameOverNoMoves').hide();
    });
    $('#closePalace').click(function () {
        $('#gameOverPalace').hide();
    });
    $('#closeCreditsButton').click(function () {
        $('#gameCredits').hide();
    });
    $('#creditsButton').click(function () {
        $('#gameCredits').show();
    });

    // event for the startbuttonclick
    $('#startButton').click(function () {
        startButtonClick();
    });

    // Build a deck of adaman cards
    deck = adamanCreateDeck();

    // create the on screen card image tags
    createOnScreenCards();

}

//
// checks to see if it is posible to make a move, returns true if there is
//
function isThereAMove() {
    var returnValue = false; // assume can not go.

    // iterate through the Palace & city spaces, and check each card
    for (var i = 0; i < deck.length; i++) {
        if (deck[i].Location.substring(0, 3) == 'pal' || deck[i].Location.substring(0, 3) == 'cit') {
            returnValue = canCardBeBeatenByResources(i,false);
            if (returnValue) {
                break;
            }
        }
    }

    return returnValue;
}

//
// check to see if there are available cards in the resources
// spaces to defeat the indicated card
//
function canCardBeBeatenByResources(targetCard, onlyCheckSelectedResourceCards) {
    var returnValue = false;
    var cardValue = deck[targetCard].Value;
    var matchingCardScores = 0;

    // loop through all cards on the resource line and get the total values of all suits
    for (var i = 0; i < deck.length; i++) {
        if (deck[i].Location.substring(0, 3) == 'res') {

            if ((onlyCheckSelectedResourceCards == false) || (onlyCheckSelectedResourceCards == true && deck[i].Selected == true)) {

                // does this resource card match the target at all?
                if (decktetDoCardsMatchOnAnySuit(targetCard, i)) {
                    //console.log('    cards match for a score of ' + deck[i].Value)

                    // we have a match, so add the cards score
                    matchingCardScores += deck[i].Value;

                    //console.log('    total matched score of ' + matchingCardScores)
                } else {
                    //console.log('    cards DONT match for a score of ' + deck[i].Value)
                }
            }
        }
    }

    if (matchingCardScores >= cardValue) {
        returnValue = true;
    }

    return returnValue;
}

//
// Start button click event
//
function startButtonClick() {
    gameOVER = false;
    score = 0;

    $('#gameOverNoMoves').hide();
    $('#whatsthestory').hide();
    $('#gameOverPalace').hide();

    moveDeckBackToDrawDeck();
    decktetShuffle(deck);
    dealToTheCity();
    dealToTheResources();
    var canContinue = isThereAMove();
    if (!canContinue) {
        gameOverNoMovesleft();
    }
}

function moveDeckBackToDrawDeck() {
    for (var i = 0; i < deck.length; i++) {
        deck[i].Selected = false;
        $(deck[i].selector).removeClass('cardselected').addClass('card');
        moveCardToSpace(i, 'drawDeckLocation');
    }
	$("#drawDeckLocation").addClass("full");
}


//
// deal cards to the resources line
// Note. any face cards go to the Palace
//
function dealToTheResources() {
    while (!dealToResourceSpace('resource1') && !gameOVER) { };
    while (!dealToResourceSpace('resource2') && !gameOVER) { };
    while (!dealToResourceSpace('resource3') && !gameOVER) { };
    while (!dealToResourceSpace('resource4') && !gameOVER) { };
    while (!dealToResourceSpace('resource5') && !gameOVER) { };
    while (!dealToResourceSpace('city1') && !gameOVER) { };
    while (!dealToResourceSpace('city2') && !gameOVER) { };
    while (!dealToResourceSpace('city3') && !gameOVER) { };
    while (!dealToResourceSpace('city4') && !gameOVER) { };
    while (!dealToResourceSpace('city5') && !gameOVER) { };
}

//
// Attempt to deal a card into a resource space
// returns true if successful
//
function dealToResourceSpace(spaceName) {

    var returnValue = false;
    if (!isThereCardInSpace(spaceName)) {
        var c = getIndexOfTopCardOnDrawDeck();
        if (c != -1) {
            if (typeof (c) != 'undefined') {
                if (deck[c].Face) {
                    pushCardToPalace(c);
                    returnValue = false;
                } else {
                    moveCardToSpace(c, spaceName);
                    returnValue = true;
                }
            }
        } else {
            // no cards to deal
            // alert('in here'); // this alert seemed to stop the locking issue.
            returnValue = true;
        }

    } else {
        // there is a card in the space
        returnValue = true;
    }
    return returnValue;
}

//
// Card was being dealt to resource but was a Face so is now being pushed to the Palace
// Returns true if able to place the card
function pushCardToPalace(indexOfCard) {
    var returnValue = false;
    var freeSpace = '';

    if (!isThereCardInSpace('palace1')) {
        freeSpace = 'palace1';
    }
    if (freeSpace == '' && !isThereCardInSpace('palace2')) {
        freeSpace = 'palace2';
    }
    if (freeSpace == '' && !isThereCardInSpace('palace3')) {
        freeSpace = 'palace3';
    }
    if (freeSpace == '' && !isThereCardInSpace('palace4')) {
        freeSpace = 'palace4';
    }
    if (freeSpace == '' && !isThereCardInSpace('palace5')) {
        freeSpace = 'palace5';
    }

    if (freeSpace != '') {
        moveCardToSpace(indexOfCard, freeSpace);
        returnValue = true;
    }
    else {
        // no palace spaces available the game is over
        gameOVER = true;
        $('#gameOverPalace').show();
        $('#finalScore2').html(score.toString());
    }

    return returnValue;
}

//
// Deal cards from the draw pile into the City Spaces
//
function dealToTheCity() {
    if (!isThereCardInSpace('city1')) { moveCardToSpace(getIndexOfTopCardOnDrawDeck(), 'city1'); }
    if (!isThereCardInSpace('city2')) { moveCardToSpace(getIndexOfTopCardOnDrawDeck(), 'city2'); }
    if (!isThereCardInSpace('city3')) { moveCardToSpace(getIndexOfTopCardOnDrawDeck(), 'city3'); }
    if (!isThereCardInSpace('city4')) { moveCardToSpace(getIndexOfTopCardOnDrawDeck(), 'city4'); }
    if (!isThereCardInSpace('city5')) { moveCardToSpace(getIndexOfTopCardOnDrawDeck(), 'city5'); }
}

//
// move specified card to a new location
//
function moveCardToSpace(indexOfCard, spaceID) {
    // find target details
    var targetOffset = $('#' + spaceID).offset();
	if (spaceID != "drawDeckLocation") $(deck[indexOfCard].selector).show();
    $(deck[indexOfCard].selector).offset(targetOffset);
    // reset cards location
    deck[indexOfCard].Location = spaceID;
}


//
// get index of the top card in the drawdeck
//
function getIndexOfTopCardOnDrawDeck() {
    var returnValue = -1;
    for (var i = 0; i < deck.length; i++) {
        if (deck[i].Location == 'drawDeckLocation') {
            returnValue = i;
            break;
        }
    }
    return returnValue;
}

//
// check if a card exists in selected space
//
function isThereCardInSpace(spaceName) {
    var returnValue = false;                    // 256 error line
    for (var i = 0; i < deck.length; i++) {
        if (deck[i].Location == spaceName) {
            returnValue = true;
            break;
        }
    }
    return returnValue;
}

//
// create a series of image tags and load up the card images.
// 
function createOnScreenCards() {
    pleaseWaitOn();
    var p = $('#drawDeckLocation').offset();
    for (var i = deck.length - 1; i >= 0; i--) {
        createOnScreenCard(deck[i]);
        $(deck[i].selector).offset({ top: p.top, left: p.left });
        $(deck[i].selector).click(function () { cardClick(this.id); });
    }
    pleaseWaitOff();
}

//
// handle a card being clicked on
//
function cardClick(theImageID) {
    if (gameOVER) {
        return;
    }

    var cardIndex = getCardIndexByID(theImageID);

    if (deck[cardIndex].Selected) {
        // deselect card
        deck[cardIndex].Selected = false;
        $(deck[cardIndex].selector).removeClass('cardselected').addClass('card');
    } else {
        // select card

        // if this card is on the palace line, deselect all other palace cards
        if (deck[cardIndex].Location.substring(0, 3) == 'pal' || deck[cardIndex].Location.substring(0, 3) == 'cit') {
            deselectAllCardsOnRow('palace');
            deselectAllCardsOnRow('city');
        }

        // mark the card as selected.
        deck[cardIndex].Selected = true;
        $(deck[cardIndex].selector).removeClass('card').addClass('cardselected');

        if (checkIfTargetAndResourceCardsAreSelected()) {
            if (canTargetBeDefeatedBySelectedResources()) {
                // Get the index of target Card
                var targetCardIndex = getTargetCardIndex();
                //alert('target card index ' + targetCardIndex);
                
                // Remove resource cards that match target card suits.
                for (var i = 0; i < deck.length; i++) {
                    if (deck[i].Selected == true) {
                        if (deck[i].Location.substring(0, 3) == 'res') {
                            if (decktetDoCardsMatchOnAnySuit(targetCardIndex, i)) {
                                //score += deck[i].Value;
                                discardCard(i);
                            }
                        }
                    }
                }


                // increment score
                //score++;
                if (deck[targetCardIndex].Face) {
                    score += deck[targetCardIndex].Value;
                }

                // deselect target card.
                deck[targetCardIndex].Selected = false;
                $(deck[targetCardIndex].selector).removeClass('cardselected').addClass('card');
    

                // If target card is not a face card is should be moved to the resource line.
                if (deck[targetCardIndex].Face == false) {
                    //alert('moving '+ deck[targetCardIndex].Name + ' to a resource space');
                    if (!isThereCardInSpace('resource1')) {
                        moveCardToSpace(targetCardIndex, 'resource1');
                    } else if (!isThereCardInSpace('resource2')) {
                        moveCardToSpace(targetCardIndex, 'resource2');
                    } else if (!isThereCardInSpace('resource3')) {
                        moveCardToSpace(targetCardIndex, 'resource3');
                    } else if (!isThereCardInSpace('resource4')) {
                        moveCardToSpace(targetCardIndex, 'resource4');
                    } else if (!isThereCardInSpace('resource5')) {
                        moveCardToSpace(targetCardIndex, 'resource5');
                    }
                } else {
                    // the card is a face card, so simply discard it
                    // alert('about to discard target'); // seemed to help with locking
                    discardCard(targetCardIndex);
                    // alert('after discarding target'); // seemed to help with lockeing

                }

                // Deal to resource line.
                debugOn = true;
                dealToTheResources();

                // if there are no cards in the resource line, the game is over
                if (getResourceCount() == 0) {
                    //alert('TODO game is over cos the resource line is empty'); // this seemed to help with locking
                }
            }
        }

        if (!isThereAMove()) {
            gameOVER = true;
            gameOverNoMovesleft();
        }
    }
}

//
// count the number of cards in the resource line
//
function getResourceCount() {
    var returnValue = 0;

    for (var i = 0; i < deck.length; i++) {
        if (deck[i].Location.substring(0, 3) == 'res') {
            returnValue++;
            if(returnValue == 5) { break; }
        }
    }
    return returnValue;
}


//
// Discard a selected card
//
function discardCard(cardIndex) {
    deck[cardIndex].Selected = false; // deselect it card
    $(deck[cardIndex].selector).removeClass('cardselected').addClass('card'); // remove selected class
    moveCardToSpace(cardIndex, 'discardDeckLocation');
}

//
// get the index of the Target Card
//
function getTargetCardIndex() {
    var returnValue = -1;
    for (var i = 0; i < deck.length; i++) {
        if (deck[i].Selected) {
            if (deck[i].Location.substring(0, 3) == 'pal' || deck[i].Location.substring(0, 3) == 'cit') {
                returnValue = i;
                break;        
            }
        }
    }
    return returnValue;
}


//
// can the selected targetCard be defeated by the selected resource cards
//
function canTargetBeDefeatedBySelectedResources() {
    var returnValue = false;

    // get index of selected target
    var selectedTargetIndex = getTargetCardIndex();
    returnValue = canCardBeBeatenByResources(selectedTargetIndex, true);

    return returnValue;
}

//
// check that both a target card and a resource card are selected
//
function checkIfTargetAndResourceCardsAreSelected() {
    var returnValue = false;
    var palaceOrCityCardSelected = false;
    var resourceCardSelected = false;

    for (var i = 0; i < deck.length; i++) {
        if (deck[i].Selected == true) {
            if (deck[i].Location.substring(0, 3) == 'pal' || deck[i].Location.substring(0, 3) == 'cit') {
                //alert('selected ' + deck[i].Name);
                palaceOrCityCardSelected = true;
            } else {
                //alert('selected ' + deck[i].Name);
                resourceCardSelected = true;
            }
        }
    }

    return (palaceOrCityCardSelected && resourceCardSelected);
}


//
// deselect cards on specified row
//
function deselectAllCardsOnRow(rowName) {
    for (var i = 0; i < deck.length; i++) {
        if (deck[i].Location.substring(0, rowName.length) == rowName) {
            if (deck[i].Selected == true) {
                deck[i].Selected = false;
                $(deck[i].selector).removeClass('cardselected').addClass('card');
            }
        }
    }
}

//
// get card index based on id
//
function getCardIndexByID(theID) {
    var returnValue = -1;
    for (var i = 0; i < deck.length; i++) {
        if (deck[i].divID == theID) {
            returnValue = i;
            break;
        }
    }
    return returnValue;
}

//
// create a deck of cards suitable for Adaman
//
function adamanCreateDeck() {
    var adamanDeck = decktetCreateDeck();
    adamanDeck = decktetRemoveCOURT(adamanDeck);
    adamanDeck = decktetRemovePAWN(adamanDeck);
    adamanDeck = decktetRemoveTheExcuse(adamanDeck);
    adamanDeck = decktetShuffle(adamanDeck);
    for (var i = 0; i < adamanDeck.length; i++) {
        adamanDeck[i].Location = 'drawDeckLocation';
        adamanDeck[i].divID = adamanDeck[i].Name.replace(/\s+/g, '');
        adamanDeck[i].selector = '#' + adamanDeck[i].divID;
    }
    return adamanDeck;
}

//
// create an on-screen card element
//
function createOnScreenCard(card) {
    var imageLit = '<img id="' + card.divID + '" src="CardImages/' + card.Image + '" title="' + card.Name + '" class="card' + (card.Face ? ' face' : '') +  '"/>';
    $(imageLit).appendTo('#gamewrapper').hide();
}

//
// "Please wait" functions
//
function pleaseWaitOn() { $('#pleaseWait').show();}
function pleaseWaitOff() { $('#pleaseWait').hide();}

//
// The Game is over as there are no available moves
//
function gameOverNoMovesleft() {
    gameOVER = true;
    $('#finalScore').html(score.toString());
    $('#gameOverNoMoves').show();
}




