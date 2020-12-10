/*
 File: https://mikeqrtll.github.io/assignments/assignment8/js/scrabble.js
 COMP.4610 Assignment No. 8: Implementing a Bit of Scrabble with Drag-and-Drop
 Michael Quaratiello, UMass Lowell Computer Science Student enrolled in COMP.4610 (Formerly 91.61 GUI Programming I), Michael_Quaratiello@student.uml.edu
 Copyright (c) 2020 by Michael Quaratiello. All rights reserved. May be
 freely copied or excerpted for educational purposes with credit to the author.
 Created by Michael Quaratiello on December 4, 2020 at 6:00 PM
 This file provides the JavaScript functionality for the scrabble board, including drag and drop aspects
*/


 /*  Array based Jesse M. Heines, UMass Lowell Computer Science, heines@cs.uml.edu */
var ScrabbleTiles = [
{"letter":"A", "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9  },
{"letter":"B", "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  },
{"letter":"C", "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  },
{"letter":"D", "value" : 2,  "original-distribution" : 4,  "number-remaining" : 4  },
{"letter":"E", "value" : 1,  "original-distribution" : 12, "number-remaining" : 12 },
{"letter":"F", "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  },
{"letter":"G", "value" : 2,  "original-distribution" : 3,  "number-remaining" : 3  },
{"letter":"H", "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  },
{"letter":"I", "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9  },
{"letter":"J", "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1  },
{"letter":"K", "value" : 5,  "original-distribution" : 1,  "number-remaining" : 1  },
{"letter":"L", "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  },
{"letter":"M", "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  },
{"letter":"N", "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  },
{"letter":"O", "value" : 1,  "original-distribution" : 8,  "number-remaining" : 8  },
{"letter":"P", "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  },
{"letter":"Q", "value" : 10, "original-distribution" : 1,  "number-remaining" : 1  },
{"letter":"R", "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  },
{"letter":"S", "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  },
{"letter":"T", "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  },
{"letter":"U", "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  },
{"letter":"V", "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  },
{"letter":"W", "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  },
{"letter":"X", "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1  },
{"letter":"Y", "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  },
{"letter":"Z", "value" : 10, "original-distribution" : 1,  "number-remaining" : 1  },
{"letter":"_", "value" : 0,  "original-distribution" : 2,  "number-remaining" : 2  },
]

//Use to verify number-remaining of each tile for debugging purposes
function logTileCount(){
    for (var i = 0; i < ScrabbleTiles.length; i++){
        console.log(ScrabbleTiles[i].letter+ ": " +ScrabbleTiles[i]["number-remaining"]);
    }
}

//Total score counter
var TotalScore = 0;

//Getting html element of placeholders
var scoreDisplay = document.getElementById('Score');
var totalScoreDisplay = document.getElementById('totalScore');
var messageDisplay = document.getElementById("message");
var validString = document.getElementById("validStr")

//Round score counter
var score = 0;

//Dropped in acceptable area flag
var flag = 0;

//Current slot of board, used to make sure future drops are to the right of most recently place tile
CurrentSlot = 1;

//Used in calculating bonus tiles
var tripleWordFactor = 0;
var doubleWordFactor = 0;

//array for letter making word
var word = [];

//Created droppable tiles and define various functions
function createDroppablesDraggables() {
    //Make all rack_blocks elements draggable
    $(".rack_blocks").draggable({
        //snap to inner portion of board tiles, with a wider tolerance than default
        snap: ".board_tiles", 
        snapMode: "inner",
        snapTolerance:30,
        //Defines what constitutes a revert
        revert: function No(event, ui) {
            //If dropped in an acceptable area, dont revert
            if(flag == 1)
            {
                //reset flag
                flag = 0;
                //Increment where next acceptable area is
                CurrentSlot++;
                messageDisplay.textContent = "";
                //Don't revert
                return false;
            }
            else{
                //revert
                if(CurrentSlot == 1)
                {
                    //First block message fault
                    messageDisplay.textContent = "Please drag the first block to the center tile, indicated by the star!";
                }
                else{
                    //Rest of messages
                    messageDisplay.textContent = "Please drag your next block directly to the right of the most recently placed block!";
                }
                return true;
            }
        }, 
    });

    //Make board_tiles accept rack blocks
    $(".board_tiles").droppable({
        accept: '.rack_blocks', 
        drop: 
        function Drop(event, ui) {
            //Get Letter value of tile
            var letter = ui.draggable.prop('id');
            //Get raw value of board tile location
            var dropId = $(this).attr("id");
            //Convert raw value to integer
            var number = parseInt(dropId);
            //Get class for multiplication reasons
            var boardTileClass = $(this).attr("class");
            var firstClass = boardTileClass.split(" ")[0];
            //If drop was in desired location for current status continue
            if(number == CurrentSlot)
            {
                //If dropping a blank tile, get value and ensure its a valid entry
                if(letter == "_")
                {
                    choice = prompt("Please enter value you would like to fill the blank tile with!");
                    //console.log("LOG: " +choice);
                    //Regex for one letter and not null and then create tile with that letter
                    if(choice != null && /^[A-Z]$/i.test(choice))
                    {
                        ui.draggable.prop('src',"graphics_data/Scrabble_Tiles/Scrabble_Tile_"+choice.toUpperCase()+".jpg");
                        letter = choice.toUpperCase();
                    }
                    //If bad entry revert
                    else {
                        return false;
                    }
                }
                //Valid drop flag set
                flag = 1;
                validString.textContent = ""
                console.log("Tile dropped: "+ letter + " Board Tile: " + number);
                //Start the calculation process
                for (var i = 0; i < ScrabbleTiles.length; i++){
                    //Get letter dropped letter object
                    if (ScrabbleTiles[i].letter == letter){
                        //If triple word tile reached, triple score, taking into consideration other multipliers
                        if(firstClass === "tripleWordTile")
                        {
                            tripleWordFactor++;
                            //console.log(ScrabbleTiles[i].value)
                            score = score * 3 + ScrabbleTiles[i].value  * Math.pow(3, tripleWordFactor) * Math.pow(2, doubleWordFactor);

                        }
                        //If triple letter tile reached, triple letter, taking into consideration other multipliers
                        else if (firstClass === "tripleLetterTile")
                        {
                           score = score + ScrabbleTiles[i].value * 3  * Math.pow(3, tripleWordFactor) * Math.pow(2, doubleWordFactor);
                        }
                        //If double word tile reached, double word, taking into consideration other multipliers
                        else if (firstClass === "doubleWordTile")
                        {
                            doubleWordFactor++;
                            //console.log(ScrabbleTiles[i].value)
                            score = score * 2 + ScrabbleTiles[i].value  * Math.pow(3, tripleWordFactor) * Math.pow(2, doubleWordFactor);    
                        }
                        //If double letter tile reached, double letter, taking into consideration other multipliers
                        else if (firstClass === "doubleLetterTile")
                        {
                            score = score + ScrabbleTiles[i].value * 2  * Math.pow(3, tripleWordFactor) * Math.pow(2, doubleWordFactor);
                        }
                        //If no bonus, just add letter value, taking into consideration other multipliers
                        else
                        {
                            score += ScrabbleTiles[i].value * Math.pow(3, tripleWordFactor) * Math.pow(2, doubleWordFactor);
                        }
                    }
                  }
                  word.push(letter);
                  console.log(word);
                  //Lock in valid entry and disable draggability
                  ui.draggable.draggable( 'disable' )
                  //display score
                  scoreDisplay.textContent = score;
            }
        }, 
        //Declare Drag, mainly for debugging, but revert when invalid drag occurs
        out: function Drag(event, ui) {
           //console.log("Dragging");
        }, 
        revert: 'invalid'});
}

//Generate board and initialize variables
function generateBoard() {
    //Initialize variables
    var letter;
    var random;
    var added = 7;
    totalScoreDisplay.textContent = 0;
    scoreDisplay.textContent = 0;
    //Generate random tiles with random integer seed
    for (var i = 0; i < added; i++) {
        random = Math.floor((Math.random() * 27));
        while(ScrabbleTiles[random]["number-remaining"] <= 0)
        {
            //If picked a letter with a number-remaining less than or equal to zero, need to pick a different letter
            random = Math.floor((Math.random() * 27));
            //If all tiles number-remaining is zero, make the tiles recently created draggable/droppable and exit
            if (checkRemainingTiles() == 0)
            {
                createDroppablesDraggables();
                return;
            }
        }
        //Subtract the number remaining from the tile generated
        ScrabbleTiles[random]["number-remaining"]--;
        letter = ScrabbleTiles[random].letter; 
        //26 is the blank tile, need another line to add _Blank
        if(random == 26){
            $("#rack").append(" <img id=\"" + letter + "\" class=\"rack_blocks\" src=\"graphics_data/Scrabble_Tiles/Scrabble_Tile_Blank.jpg\">")
        }
        //If not 26, add letter _A, _B, _C, ...
        else{
            $("#rack").append(" <img id=\"" + letter + "\" class=\"rack_blocks\" src=\"graphics_data/Scrabble_Tiles/Scrabble_Tile_" + letter + ".jpg\">")
        }
        
    }
    //Create table and drag/dropables
    createTable();
    createDroppablesDraggables();
}

//Creating the table, add html code to a string and board to that string
function createTable() {
    var content = "";
    content +="<table>";
    content+="<tr>"
    content+="<td id=\"1\" class=\"centerTile board_tiles\"></td>"
    content+="<td id=\"2\" class=\"board_tiles\"></td>"
    content+="<td id=\"3\" class=\"doubleLetterTile board_tiles\"></td>"
    content+="<td id=\"4\" class=\"doubleWordTile board_tiles\"></td>"
    content+="<td id=\"5\" class=\"board_tiles\"></td>"
    content+="<td id=\"6\" class=\"tripleLetterTile board_tiles\"></td>"
    content+="<td id=\"7\" class=\"tripleWordTile board_tiles\"></td>"
    content+="</tr>"   
    content+="</table>"
    $("#board").html(content);
}

//Iterate through ScrabbleTiles and see if any tiles have a number-remaining greater than 0
function checkRemainingTiles()
{
    var temp=0;
    for (var i = 0; i < ScrabbleTiles.length; i++){
        if (ScrabbleTiles[i]["number-remaining"] > 0){
            temp = 1;
        }
    }
    if(temp == 1)
    {
        return true;
    }
    else{
        messageDisplay.textContent = "No more tiles left in reserve, final rack!";
        return false;
    }
}


//Submit function
function submitCurrentWord() {
    //Make dictionary array lower case
    var lowerDictArray = dictArray.map(a => a.toLowerCase());
    //Create string out of tiles placed
    var wordString = word.join("").toLowerCase();
    //console.log(wordString.length);
    //Official scrabble rules indicate no one letter words
    if(wordString.length >= 2)
    {
        var n = lowerDictArray.includes(wordString)
        if(n)
        {
            validString.textContent = "Valid Word!"
        }
        else{
            validString.textContent = "Invalid Word!"
            return false;
        }
    }
    else 
    {
        validString.textContent = "Invalid Word"
        return false;
    }
    //Count how many need to be replaced
    var countRemoved = 0;
    //Remove all tiles that are locked in to the submitted word
    document.querySelectorAll('.ui-draggable-disabled').forEach(function(e){
        countRemoved++;
        e.remove()
    })

    //Reinitialize board for new round and add to TotalScore
    var letter;
    var random;
    var added = countRemoved;
    flag = 0;
    tripleWordFactor = 0;
    doubleWordFactor = 0;
    CurrentSlot = 1;
    TotalScore += score;
    totalScoreDisplay.textContent = TotalScore;
    //console.log("TOTAL SCORE: " +TotalScore);
    score = 0;
    scoreDisplay.textContent = 0;
    //Add enough to fill up to full rack, similar process as above in generateBoard
    for (var i = 0; i < added; i++) {
        random = Math.floor((Math.random() * 27));
        while(ScrabbleTiles[random]["number-remaining"] <= 0)
        {
            random = Math.floor((Math.random() * 27));
            if (checkRemainingTiles() == 0)
            {
                createDroppablesDraggables();
                return;
            }
        }
        ScrabbleTiles[random]["number-remaining"]--;
        letter = ScrabbleTiles[random].letter; 
        if(random == 26){
            $("#rack").append(" <img id=\"" + letter + "\" class=\"rack_blocks\" src=\"graphics_data/Scrabble_Tiles/Scrabble_Tile_Blank.jpg\">")
        }
        else{
            $("#rack").append(" <img id=\"" + letter + "\" class=\"rack_blocks\" src=\"graphics_data/Scrabble_Tiles/Scrabble_Tile_" + letter + ".jpg\">")
        }
        
    }
    word = [];
    createDroppablesDraggables();
}

//Restart Game
function restartGame(){
    validString.textContent = ""
    //Reset all variables and notify user that the game restarted
    flag = 0;
    tripleWordFactor = 0;
    doubleWordFactor = 0;
    CurrentSlot = 1;
    totalScoreDisplay.textContent = 0;
    TotalScore = 0;
    score = 0;
    scoreDisplay.textContent = 0;
    word = [];
    //Clear rack
    $("#rack").html("");
    //Reset number-remaining to orgininal-distribution for every letter
    for (var i = 0; i < ScrabbleTiles.length; i++){
        ScrabbleTiles[i]["number-remaining"] = ScrabbleTiles[i]["original-distribution"];
           
    }
    generateBoard();
    messageDisplay.textContent = "Game Restarted!";
}

//Return tiles to rack
function returnTilesToRack(){
    validString.textContent = ""
    var letterArray = []
    //Copy all tiles to array and remove all tiles
    document.querySelectorAll('.ui-draggable').forEach(function(e){
        letterArray.push(e.id)
        e.remove()
    })
    //Place tiles back on rack
    for (var i = 0; i < letterArray.length; i++){
        if(letterArray[i] == "_"){
            $("#rack").append(" <img id=\"" + letterArray[i] + "\" class=\"rack_blocks\" src=\"graphics_data/Scrabble_Tiles/Scrabble_Tile_Blank.jpg\">")
        }
        else{
            $("#rack").append(" <img id=\"" + letterArray[i] + "\" class=\"rack_blocks\" src=\"graphics_data/Scrabble_Tiles/Scrabble_Tile_" + letterArray[i] + ".jpg\">")
        }
    }
    //Reset score for current round and place current slot back to one, reset multipliers and notify user
    score = 0;
    scoreDisplay.textContent = 0;
    CurrentSlot = 1;
    tripleWordFactor = 0;
    doubleWordFactor = 0;
    word = [];
    createDroppablesDraggables();
    messageDisplay.textContent = "Placed tiles have been returned to the rack.";
}


//Function to swap tiles on rack with new letters
function swapTiles(){
    validString.textContent = ""
   // logTileCount();
    var letterArray = []
    //delete all tiles
    document.querySelectorAll('.ui-draggable').forEach(function(e){
        letterArray.push(e.id)
        e.remove();
    })
    //Increment the delete tiles count of number-remaining
    for (var i = 0; i < letterArray.length; i++){
        for (var j = 0; j < ScrabbleTiles.length; j++){
            //console.log(letterArray[i]);
            if (ScrabbleTiles[j].letter == letterArray[i]){
                ScrabbleTiles[j]["number-remaining"]++;
            }
        }
    }
    //logTileCount();
    //Same procedure in other functions to create tiles
    for (var i = 0; i < 7; i++) {
        random = Math.floor((Math.random() * 27));
        while(ScrabbleTiles[random]["number-remaining"] <= 0)
        {
            random = Math.floor((Math.random() * 27));
            if (checkRemainingTiles() == 0)
            {
                createDroppablesDraggables();
                return;
            }
        }
        ScrabbleTiles[random]["number-remaining"]--;
        letter = ScrabbleTiles[random].letter; 
        if(random == 26){
            $("#rack").append(" <img id=\"" + letter + "\" class=\"rack_blocks\" src=\"graphics_data/Scrabble_Tiles/Scrabble_Tile_Blank.jpg\">")
        }
        else{
            $("#rack").append(" <img id=\"" + letter + "\" class=\"rack_blocks\" src=\"graphics_data/Scrabble_Tiles/Scrabble_Tile_" + letter + ".jpg\">")
        }
        
    }
    //Reset round variables
    score = 0;
    scoreDisplay.textContent = 0;
    CurrentSlot = 1;
    tripleWordFactor = 0;
    doubleWordFactor = 0;
    createDroppablesDraggables();
    word = []
    //logTileCount();
    messageDisplay.textContent = "Tiles have been swapped and current round score has been reset.";
}

