//
//  This file was created by Felbrigg Herriot and is released under a Creative Commons Attribution NonCommercial ShareAlike 3.0 License
//

var deck;                   // source deck of cards

//
// Create and return a card object
//
function decktetCreateCard(rank, suit1, suit2, suit3, name, face, image, value) {
    return {
        Rank: rank,
        Suit1: suit1,
        Suit2: suit2,
        Suit3: suit3,
        Name: name,
        Face: face,
        Image: image,
        FaceUp: false,
        Value: value,
        Selected: false
    };
}

//
// Create a new decktet deck
//
function decktetCreateDeck() {
    var deck = new Array();
    deck.push(decktetCreateCard('Ace', 'Knots', '', '', 'Ace of Knots', false, '1_ace_knots.png', 1));
    deck.push(decktetCreateCard('Ace', 'Leaves', '', '', 'Ace of Leaves', false, '1_ace_leaves.png', 1));
    deck.push(decktetCreateCard('Ace', 'Moons', '', '', 'Ace of Moons', false, '1_ace_moons.png', 1));
    deck.push(decktetCreateCard('Ace', 'Suns', '', '', 'Ace of Suns', false, '1_ace_suns.png', 1));
    deck.push(decktetCreateCard('Ace', 'Waves', '', '', 'Ace of Waves', false, '1_ace_waves.png', 1));
    deck.push(decktetCreateCard('Ace', 'Wyrms', '', '', 'Ace of Wyrms', false, '1_ace_wyrms.png', 1));
    deck.push(decktetCreateCard('2', 'Moons', 'Knots', '', 'the AUTHOR', true, '2_author.png', 2));
    deck.push(decktetCreateCard('2', 'Suns', 'Wyrms', '', 'the DESERT', false, '2_desert.png', 2));
    deck.push(decktetCreateCard('2', 'Waves', 'Leaves', '', 'the ORIGIN', false, '2_origin.png', 2));
    deck.push(decktetCreateCard('3', 'Moons', 'Waves', '', 'the JOURNEY', false, '3_journey.png', 3));
    deck.push(decktetCreateCard('3', 'Suns', 'Knots', '', 'the PAINTER', true, '3_painter.png', 3));
    deck.push(decktetCreateCard('3', 'Leaves', 'Wyrms', '', 'the SAVAGE', true, '3_savage.png', 3));
    deck.push(decktetCreateCard('4', 'Wyrms', 'Knots', '', 'the BATTLE', false, '4_battle.png', 4));
    deck.push(decktetCreateCard('4', 'Moons', 'Suns', '', 'the MOUNTAIN', false, '4_mountain.png', 4));
    deck.push(decktetCreateCard('4', 'Waves', 'Leaves', '', 'the SAILOR', true, '4_sailor.png', 4));
    deck.push(decktetCreateCard('5', 'Suns', 'Waves', '', 'the DISCOVERY', false, '5_discovery.png', 5));
    deck.push(decktetCreateCard('5', 'Moons', 'Leaves', '', 'the FOREST', false, '5_forest.png', 5));
    deck.push(decktetCreateCard('5', 'Wyrms', 'Knots', '', 'the SOLDIER', true, '5_soldier.png', 5));
    deck.push(decktetCreateCard('6', 'Moons', 'Waves', '', 'the LUNATIC', true, '6_lunactic.png', 6));
    deck.push(decktetCreateCard('6', 'Leaves', 'Knots', '', 'the MARKET', false, '6_market.png', 6));
    deck.push(decktetCreateCard('6', 'Suns', 'Wyrms', '', 'the PENITENT', true, '6_penitent.png', 6));
    deck.push(decktetCreateCard('7', 'Suns', 'Knots', '', 'the CASTLE', false, '7_castle.png', 7));
    deck.push(decktetCreateCard('7', 'Waves', 'Wyrms', '', 'the CAVE', false, '7_cave.png', 7));
    deck.push(decktetCreateCard('7', 'Moons', 'Leaves', '', 'the CHANCE MEETING', false, '7_chance_meeting.png', 7));
    deck.push(decktetCreateCard('8', 'Wyrms', 'Knots', '', 'the BETRAYAL', false, '8_betrayal.png', 8));
    deck.push(decktetCreateCard('8', 'Moons', 'Suns', '', 'the DIPLOMAT', true, '8_diplomat.png', 8));
    deck.push(decktetCreateCard('8', 'Waves', 'Leaves', '', 'the MILL', false, '8_mill.png', 8));
    deck.push(decktetCreateCard('9', 'Waves', 'Wyrms', '', 'the DARKNESS', false, '9_darkness.png', 9));
    deck.push(decktetCreateCard('9', 'Leaves', 'Knots', '', 'the MERCHANT', true, '9_merchant.png', 9));
    deck.push(decktetCreateCard('9', 'Moons', 'Suns', '', 'the PACT', false, '9_pact.png', 9));
    deck.push(decktetCreateCard('CROWN', 'Knots', '', '', 'the WINDFALL', false, 'crown_knots.png', 10));
    deck.push(decktetCreateCard('CROWN', 'Leaves', '', '', 'the END', false, 'crown_leaves.png', 10));
    deck.push(decktetCreateCard('CROWN', 'Moons', '', '', 'the HUNTRESS', true, 'crown_moons.png', 10));
    deck.push(decktetCreateCard('CROWN', 'Suns', '', '', 'the BARD', true, 'crown_suns.png', 10));
    deck.push(decktetCreateCard('CROWN', 'Waves', '', '', 'the SEA', false, 'crown_waves.png', 10));
    deck.push(decktetCreateCard('CROWN', 'Wyrms', '', '', 'the CALAMITY', false, 'crown_wyrms.png', 10));
    deck.push(decktetCreateCard('', '', '', '', 'the EXCUSE', false, 'excuse.png', 0));
    deck.push(decktetCreateCard('PAWN', 'Waves', 'Leaves', 'Wyrms', 'the BORDERLAND', false, 'pawn_borderland.png', 11));
    deck.push(decktetCreateCard('PAWN', 'Moons', 'Suns', 'Leaves', 'the HARVEST', false, 'pawn_harvest.png', 11));
    deck.push(decktetCreateCard('PAWN', 'Suns', 'Waves', 'Knots', 'the LIGHT KEEPER', true, 'pawn_light_keeper.png', 11));
    deck.push(decktetCreateCard('PAWN', 'Moons', 'Wyrms', 'Knots', 'the WATCHMAN', true, 'pawn_watchman.png', 11));
    deck.push(decktetCreateCard('COURT', 'Moons', 'Waves', 'Knots', 'the CONSUL', true, '11_court_consul.png', 12));
    deck.push(decktetCreateCard('COURT', 'Suns', 'Waves', 'Wyrms', 'the ISLAND', false, '11_court_island.png', 12));
    deck.push(decktetCreateCard('COURT', 'Moons', 'Leaves', 'Wyrms', 'the RITE', false, '11_court_rite.png', 12));
    deck.push(decktetCreateCard('COURT', 'Suns', 'Leaves', 'Knots', 'the WINDOW', false, '11_court_window.png', 12));
    return deck;
}

//
// remove "the EXCUSE" from a deck
//
function decktetRemoveTheExcuse(deck) {
    return decktetRemoveCardByName(deck, 'the EXCUSE');
}

//
// remove a card from the deck by using it's name
//
function decktetRemoveCardByName(deck, theName) {
    for (var i = 0; i < deck.length; i++) {
        if (deck[i].Name == theName) {
            deck.splice(i, 1);
            break;
        }
    }
    return deck;
}


//
// remove the PAWN cards from the deck
//
function decktetRemovePAWN(deck) {
    return decktetRemoveRank(deck, 'PAWN');
}

//
// remove the COURT cards from the deck
//
function decktetRemoveCOURT(deck) {
    return decktetRemoveRank(deck, 'COURT');
}

//
// remove cards of a particular rank
//
function decktetRemoveRank(deck,rank) {
    for (var i = deck.length-1; i >= 0 ; i--) {
        if (deck[i].Rank == rank) {
            deck.splice(i, 1);
        }
    }
    return deck;
}

//
// shuffle a deck of cards
//
function decktetShuffle(deck) {
    for (var i = 0; i < deck.length; i++) {
        // move card from i to n
        n = 0;
        while(n == 0 || n == i)
        {
            n = Math.floor(Math.random() * (deck.length - 1)) + 1;
        }
        var temp = deck[i];
        deck[i] = deck[n];
        deck[n] = temp;
    }
    return deck;
}

//
// Do the specified cards match on any suit?
//
function decktetDoCardsMatchOnAnySuit(card1, card2) {
    var returnValue = false;

    // iterate through the first card's suits
    for (var s = 1; s < 4; s++) {
        var suitPosition = 'Suit' + s;
        var suit = eval('deck[card1].' + suitPosition);
        // only check when there is a suit to check
        if (suit != '') {
            // now iterate through the seconds cards suits to check
            for (var s2 = 1; s2 < 4; s2++) {
                var suitPosition2 = 'Suit' + s2;
                var suit2 = eval('deck[card2].' + suitPosition2);
                // check for match
                if (suit == suit2) {
                    // Huzzar a match!
                    returnValue = true;
                    break;
                }
            }
        }

        if (returnValue) {
            break;
        }
    }

    return returnValue;
}