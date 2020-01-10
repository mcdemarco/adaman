//
// This file was created by Felbrigg Herriot and remixed by M. C. DeMarco, and is released under a Creative Commons Attribution NonCommercial ShareAlike 3.0 License
//

//
// Global Variables
//
var gameOVER = false;       // overall flag to indicate the game is over
var score = 0;
var personalityCount = 0;
var personalityTotal;
var discardCount = 0;
var defaultSettings = {speed: 300,
					   magnification: false,
					   blackmoons: true,
					   difficulty: 'normal'};
var speed;

//
// runs when the page first loads
//
function initialise_GamePage() {

	//Settings.
	// need speed first.
	speed = getSetting('speed');
	$('input#speed').val(speed);
	
	//speed monitor
	$('input#speed').change(function() {
		if (parseInt($("input#speed").val()) > -1)
			speed = parseInt($("input#speed").val());
		setSetting('speed',speed);
	});

	// need magnification to set up the button
	// This is a little awkward but will be cleaned up later for a third option
	if (getSetting('magnification') == true) {
		$('body').addClass('embiggen1');
		$('#plusButton').html("Normal");
	}
	$('#plusButton').click(function () {
		$('body').toggleClass('embiggen1');
		if ($('#plusButton').html() == "Enlarge") {
			setSetting('magnification',true);
			$('#plusButton').html("Normal");
		} else {
			setSetting('magnification',false);
			$('#plusButton').html("Enlarge");
		}
	});

	//Fill in the rest of the settings form
	$("input[name=difficulty]").val([getSetting('difficulty')]);
	$("input#emblacken").prop("checked",getSetting('blackmoons'));
	

	// set up the click events for the panels
	$('#showStoryButton').click(function () {
		$('.panel').hide();
		$('#whatsthestory').fadeIn(speed);
	});
	$('#settingsButton').click(function () {
		$('.panel').hide();
		$('#settingsPanel').fadeIn(speed);
	});
	$('#creditsButton').click(function () {
		$('.panel').hide();
		$('#gameCredits').fadeIn(speed);
	});
	$('#personalitiesButton').click(function () {
		$('.panel').hide();
		$('#personalityPanel').fadeIn(speed);
	});
	$('.close.button').click(function () {
		$('.panel').hide();
	});
	$('#gameOverCloseButton').click(function () {
		//semi clean up
		moveDeckBackToDrawDeck();
	});
	

	// event for the start/replay buttons
	$('#startButton').click(function () {
		startButtonClick();
	});
	$('#replayButton').click(function () {
		startButtonClick(true);
	});
	
	initialiseDeck();
}

function initialiseDeck(again) {

  // Build a deck of adaman cards
  deck = adamanCreateDeck();
	
  // create the on screen card image tags
  createOnScreenCards(again);

	//Revise the scores.
	$("#personalityCount").html(personalityCount + " (" + personalityTotal + ")");

}

//
// checks to see if it is posible to make a move, returns true if there is
//
function isThereAMove() {
    var returnValue = false; // assume can not go.

    // iterate through the Palace & capital spaces, and check each card
    for (var i = 0; i < deck.length; i++) {
        if (deck[i].Location.substring(0, 3) == 'pal' || deck[i].Location.substring(0, 3) == 'cap') {
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
                    // we have a match, so add the cards score
                    matchingCardScores += deck[i].Value;
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
function startButtonClick(replay) {
  gameOVER = false;
  score = 0;
	personalityCount = 0;
	discardCount = 0;

	$("#runningScore").html(score);
	$("#personalityCount").html(personalityCount + " (" + personalityTotal + ")");
  $('.panel').hide();

  moveDeckBackToDrawDeck();
	//Set the other two settings here for convenience.
	if (getSetting('difficulty') != $("input[name=difficulty]:checked").val() || getSetting('blackmoons') != $("input#emblacken").is(":checked")) {
		setSetting('difficulty', $("input[name=difficulty]:checked").val());
		setSetting('blackmoons', $("input#emblacken").is(":checked").toString());
		//If these values have changed since the deck was created, then we need to recreate it.
		initialiseDeck(true);
	}
	if (!replay)
		decktetShuffle(deck);
	stackDeck();
  dealToTheCapital();
  dealToTheResources();
  var canContinue = isThereAMove();
  if (!canContinue) {
		//Delay is for 5 capitol cards + 5 palace cards + up to 5 resource cards.
    gameIsOver(15);
  }
}

function moveDeckBackToDrawDeck() {
	$("#drawDeckLocation").addClass("full");
    for (var i = 0; i < deck.length; i++) {
        deck[i].Selected = false;
        moveCardToSpace(i, 'drawDeckLocation', 0.1);
        $(deck[i].selector).removeClass('cardselected').hide();
    }
}


//
// deal cards to the resources line
// Note. any face cards go to the Palace
//
function dealToTheResources(delayUnits) {
	for (var r=1 ;r<6; r++)
		while (!dealToResourceSpace('resource' + r, (typeof delayUnits =='undefined' ? r + 5 : delayUnits + r/5)) && !gameOVER) { };

	//	
	/* Isn't this going to toss personalities into the Palace?
	for (var c=1 ;c<6; c++)
		while (!dealToResourceSpace('capital' + c, c) && !gameOVER) { };
	 */
}

//
// Attempt to deal a card into a resource space
// returns true if successful
//
function dealToResourceSpace(spaceName, delayUnits) {
    var returnValue = false;
    if (!isThereCardInSpace(spaceName)) {
        var c = getIndexOfTopCardOnDrawDeck();
        if (c != -1) {
            if (typeof (c) != 'undefined') {
                if (deck[c].Face) {
                    pushCardToPalace(c,delayUnits);
                    returnValue = false;
                } else {
                    moveCardToSpace(c, spaceName,delayUnits);
                    returnValue = true;
                }
            }
        } else {
            // no cards to deal
            returnValue = true;
        }

    } else {
        // there is a card in the space
        returnValue = true;
    }
	if (!isThereCardInSpace('drawDeckLocation')) {
		//We used the last card.
		$("#drawDeckLocation").removeClass("full");
	}
    return returnValue;
}

//
// Card was being dealt to resource but was a Face so is now being pushed to the Palace
// Returns true if able to place the card
function pushCardToPalace(indexOfCard, delayUnits) {
  var returnValue = false;
  var freeSpace = '';
	
  if (!isThereCardInSpace('palace1')) {
    freeSpace = 'palace1';
		delayUnits = delayUnits - 0.83;
  } else if (!isThereCardInSpace('palace2')) {
    freeSpace = 'palace2';
		delayUnits = delayUnits - 0.66;
  } else if (!isThereCardInSpace('palace3')) {
    freeSpace = 'palace3';
		delayUnits = delayUnits - 0.5;
  } else if (!isThereCardInSpace('palace4')) {
    freeSpace = 'palace4';
		delayUnits = delayUnits - 0.33;
  } else if (!isThereCardInSpace('palace5')) {
    freeSpace = 'palace5';
		delayUnits = delayUnits - 0.17;
  }

    if (freeSpace != '') {
        moveCardToSpace(indexOfCard, freeSpace, delayUnits);
        returnValue = true;
    } else {
        // no palace spaces available the game is over
        gameIsOver("palace",delayUnits);
    }

    return returnValue;
}

//
// Deal cards from the draw pile into the Capital Spaces
//
function dealToTheCapital(discardCount) {
	for (var c=1; c<=5; c++) {
		if (!isThereCardInSpace('capital' + c)) {
			var d = getIndexOfTopCardOnDrawDeck();
			if (d != -1) {
				moveCardToSpace(getIndexOfTopCardOnDrawDeck(), 'capital' + c, (discardCount ? discardCount : c));
			} else {
				// no cards to deal
			}
		}
	}
	if (!isThereCardInSpace('drawDeckLocation')) {
		//We used the last card.
		$("#drawDeckLocation").removeClass("full");
	}
}

//
// move specified card to a new location
//
function moveCardToSpace(indexOfCard, spaceID, delayUnits) {
  // find target details
  var targetOffset = $('#' + spaceID).offset();
	if (typeof delayUnits == 'undefined') 
		delayUnits = 1;
	var delay = delayUnits * speed;
	if (spaceID != "drawDeckLocation") {
		$(deck[indexOfCard].selector).fadeIn(speed);
	}
  $(deck[indexOfCard].selector).delay(delay).transition({left:targetOffset.left, top:targetOffset.top},speed,"snap");
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
function createOnScreenCards(again) {
  pleaseWaitOn();
	if (again) {
		//Delete existing cards.
		$(".card:not(.pers)").remove();
		$(".pers").css("background-image","none").removeClass("controlled").removeClass("uncontrolled");
	}
  var p = $('#drawDeckLocation').offset();
  for (var i = deck.length - 1; i >= 0; i--) {
    createOnScreenCard(deck[i],i);
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
        $(deck[cardIndex].selector).removeClass('cardselected');
    } else {
        // select card

        // if this card is on the palace or capital line, deselect all other palace and capital cards
        if (deck[cardIndex].Location.substring(0, 3) == 'pal' || deck[cardIndex].Location.substring(0, 3) == 'cap') {
            deselectAllCardsOnRow('palace');
            deselectAllCardsOnRow('capital');
        }

        // mark the card as selected.
        deck[cardIndex].Selected = true;
        $(deck[cardIndex].selector).addClass('cardselected');

      if (checkIfTargetAndResourceCardsAreSelected()) {
        if (canTargetBeDefeatedBySelectedResources()) {
          // Get the index of target Card
          var targetCardIndex = getTargetCardIndex();
          
          // Remove resource cards that match target card suits.
					var discardCount = 1;
          for (var i = 0; i < deck.length; i++) {
            if (deck[i].Selected == true) {
              if (deck[i].Location.substring(0, 3) == 'res') {
                if (decktetDoCardsMatchOnAnySuit(targetCardIndex, i)) {
									discardCount++;
                  discardCard(i,discardCount);
                }
              }
            }
          }
					

          // increment score
          //score++;
          if (deck[targetCardIndex].Face) {
            score += deck[targetCardIndex].Value;
          }

          // If target card is not a face card is should be moved to the resource line.
          if (deck[targetCardIndex].Face == false) {
                    if (!isThereCardInSpace('resource1')) {
                        moveCardToSpace(targetCardIndex, 'resource1',discardCount);
                    } else if (!isThereCardInSpace('resource2')) {
                        moveCardToSpace(targetCardIndex, 'resource2',discardCount);
                    } else if (!isThereCardInSpace('resource3')) {
                        moveCardToSpace(targetCardIndex, 'resource3',discardCount);
                    } else if (!isThereCardInSpace('resource4')) {
                        moveCardToSpace(targetCardIndex, 'resource4',discardCount);
                    } else if (!isThereCardInSpace('resource5')) {
                        moveCardToSpace(targetCardIndex, 'resource5',discardCount);
                    }
          } else {
                    // the card is a face card, so simply discard it
                    discardCard(targetCardIndex,1);
          }
					
					// deselect target card.
          deck[targetCardIndex].Selected = false;
          $(deck[targetCardIndex].selector).delay(discardCount).removeClass('cardselected');
					
          // Deal to capital and resource lines.
          dealToTheCapital(discardCount);
					// +1 for any Capital cards, +1 for any Palace deals.
          dealToTheResources(discardCount + 2);
					
          // if there are no cards in the resource line, the game is over
          if (getResourceCount() == 0) {
						//This would fall through to (and hopefully fail) the move check, but stop anyway.
						gameIsOver('noMoves',discardCount + 2);
          }
        }
      }

      if (!isThereAMove()) {
        gameIsOver('noMoves',discardCount + 2);
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
// get the total card value in the resource line for scoring
//
function getResourceScore() {
  var returnValue = 0;
	var resourceCount = getResourceCount();
	var resourceCounter = 0;

  for (var i = 0; i < deck.length; i++) {
    if (deck[i].Location.substring(0, 3) == 'res') {
      returnValue += deck[i].Value;
			resourceCounter++;
      if (resourceCounter == resourceCount) { break; }
    }
  }
  return returnValue;
}


//
// Discard a selected card
//
function discardCard(cardIndex,delayUnits) {
	discardCount++;
  deck[cardIndex].Selected = false; // deselect it card
  $(deck[cardIndex].selector).removeClass('cardselected');
	$(deck[cardIndex].selector).css("z-index",delayUnits);
  moveCardToSpace(cardIndex, 'discardDeckLocation',1);
	if (deck[cardIndex].Face) {
		countPersonality(delayUnits);
		//Mark personality controlled in the personality display.
		var perId = deck[cardIndex].Name.replace("the ", "per").replace(" ","_");
		$("#" + perId + " div.card").removeClass("uncontrolled").addClass("controlled");
	}
}

function countPersonality(delayUnits) {
	personalityCount++;
	$("#personalityCount").html(personalityCount + " (" + personalityTotal + ")");
	//The running score only changes for personalities, so though it was incremented elsewhere, update here.
	$("#runningScore").html(score);
	if (personalityCount == personalityTotal) {
		gameIsOver("victory",delayUnits);
	}
}

//
// get the index of the Target Card
//
function getTargetCardIndex() {
    var returnValue = -1;
    for (var i = 0; i < deck.length; i++) {
        if (deck[i].Selected) {
            if (deck[i].Location.substring(0, 3) == 'pal' || deck[i].Location.substring(0, 3) == 'cap') {
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
    var palaceOrCapitalCardSelected = false;
    var resourceCardSelected = false;

    for (var i = 0; i < deck.length; i++) {
        if (deck[i].Selected == true) {
            if (deck[i].Location.substring(0, 3) == 'pal' || deck[i].Location.substring(0, 3) == 'cap') {
                //alert('selected ' + deck[i].Name);
                palaceOrCapitalCardSelected = true;
            } else {
                //alert('selected ' + deck[i].Name);
                resourceCardSelected = true;
            }
        }
    }

    return (palaceOrCapitalCardSelected && resourceCardSelected);
}


//
// deselect cards on specified row
//
function deselectAllCardsOnRow(rowName) {
    for (var i = 0; i < deck.length; i++) {
        if (deck[i].Location.substring(0, rowName.length) == rowName) {
            if (deck[i].Selected == true) {
                deck[i].Selected = false;
                $(deck[i].selector).removeClass('cardselected');
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
	var difficulty = getSetting('difficulty');
  var adamanDeck = decktetCreateDeck();
	//This one can be used but would be complicated to program, so ditch it.
  adamanDeck = decktetRemoveTheExcuse(adamanDeck);
	//The normal deck.
	if (difficulty == "normal") {
		adamanDeck = decktetRemoveCOURT(adamanDeck);
		adamanDeck = decktetRemovePAWN(adamanDeck);
		personalityTotal = 11;
	} else if (difficulty != "easy") {
		//Remove the non-personality pawns and courts.
		adamanDeck = decktetRemoveCardByName(adamanDeck,'the HARVEST');
		adamanDeck = decktetRemoveCardByName(adamanDeck,'the BORDERLAND');
		adamanDeck = decktetRemoveCardByName(adamanDeck,'the WINDOW');
		adamanDeck = decktetRemoveCardByName(adamanDeck,'the RITE');
		adamanDeck = decktetRemoveCardByName(adamanDeck,'the ISLAND');

		//Pick the random personality.
		var randam = Math.floor(Math.random()*3);
		var nameArray = ['the LIGHT KEEPER','the WATCHMAN','the CONSUL'];
		var i;
		if (difficulty == "harder") {
			//remove 1, leave 2
			adamanDeck = decktetRemoveCardByName(adamanDeck, nameArray[randam]);
			personalityTotal = 13;
		} else if (difficulty == "hard") {
			//remove 2, leave 1
			for (i=0; i<3; i++) {
				if (i != randam)
					adamanDeck = decktetRemoveCardByName(adamanDeck, nameArray[i]);	
			}
			personalityTotal = 12;
		} else {
			//Else keep them all for hardest.
			personalityTotal = 14;
		}
	} else {
		//Set personality count for easy level.
		personalityTotal = 14;
	}
	
  adamanDeck = decktetShuffle(adamanDeck);
  for (i = 0; i < adamanDeck.length; i++) {
    adamanDeck[i].Location = 'drawDeckLocation';
    adamanDeck[i].divID = adamanDeck[i].Name.replace(/\s+/g, '');
    adamanDeck[i].selector = '#' + adamanDeck[i].divID;
		//Tweak values of pawns and courts.
		if (adamanDeck[i].Rank == "PAWN" || adamanDeck[i].Rank == "COURT")
			adamanDeck[i].Value = 10;
  }
  return adamanDeck;
}

//
// create an on-screen card element
//
function createOnScreenCard(card,index) {
	var emblacken = getSetting('blackmoons');
	var cardImage = card.Image;
	if (emblacken && (card.Suit1 == "Moons" ||card.Suit2 == "Moons" ||card.Suit3 == "Moons"))
		cardImage = cardImage.split(".png")[0] + "_black.png";
  var imageLit = '<div id="' + card.divID + '" class="card'  + (card.Face ? ' face' : '') + '" style="background-image:url(CardImages/' + cardImage + ');" title="' + card.Name + '"></div>';
  $(imageLit).appendTo('#gamewrapper').hide();
	if (card.Face) {
		var perId = card.Name.replace("the ", "per").replace(" ","_");
		$("#" + perId + " div.card").css("background-image","url(CardImages/" + cardImage + ")").addClass("uncontrolled");
	}
}

//
// stack the cards
//
function stackDeck() {
    for (var i = 0; i < deck.length; i++) {
		$(deck[i].selector).css("z-index",deck.length-i);
	}
}


//
// "Please wait" functions
//
function pleaseWaitOn() { $('#pleaseWait').show();}
function pleaseWaitOff() { $('#pleaseWait').hide();}

//
// The Game is over as there are no available moves
//

function gameIsOver(endCondition,delayUnits) {
    gameOVER = true;
	endCondition = typeof endCondition !== 'undefined' ? endCondition : "noMoves";
	if (endCondition == "victory") {
		//We have some more scoring to do.
		score += getResourceScore();
		$('#runningScore').html(score.toString());
	} else if (endCondition == "palace") {
		//We have some unscoring to do.
		score = 0;
		$('#runningScore').html(score.toString());
	}
    $('#finalScore').html(score.toString());
	switch(endCondition) {
		case "victory":
			$("#endCondition").html("Victory is yours!  You have control of everyone who matters and can safely seize the throne.");
			break;
		case "palace":
			$("#endCondition").html("The opposition in the Palace has become too great.");
			break;
		default:
			$("#endCondition").html("There are no more possible moves.");
	}
	delayUnits = typeof delayUnits !== 'undefined' ? delayUnits : 0;
    $('#gameOver').delay(delayUnits * speed).show(speed);
}

function getSetting(setting) {
	if (window.localStorage && typeof window.localStorage.getItem(setting) !== 'undefined' && window.localStorage.getItem(setting) !== null) {
		var value;
		try {
			value = window.localStorage.getItem(setting);
		} catch (e) {
			value = defaultSettings[setting];
		}
		if (setting == 'blackmoons' || setting == 'magnification')  value = (value.toLowerCase() === "true");
		return value;
	} else {
		return defaultSettings[setting];
	}
}

function setSetting(setting, value) {
	if (window.localStorage) {
		try {
			window.localStorage.setItem(setting, value);
			return true;
		} catch (e) {
			return false;
		}
	} else {
		return false;
	}
}
