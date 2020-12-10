/*
 File: https://mikeqrtll.github.io/assignments/assignment7/js/table.css
 COMP.4610 Assignment No. 7: Using the jQuery UI Slider and Tab Widgets
 Michael Quaratiello, UMass Lowell Computer Science Student enrolled in COMP.4610 (Formerly 91.61 GUI Programming I), Michael_Quaratiello@student.uml.edu
 Copyright (c) 2020 by Michael Quaratiello. All rights reserved. May be
 freely copied or excerpted for educational purposes with credit to the author.
 Created by Michael Quaratiello on November 20, 2020 at 6:00 PM
 This file provides the JavaScript and jQuery Validation Plugin code for index.html, specifically the creation of the multiplication table based off input from the html form.
 Additionally it includes the code for tab creation and jQuery UI sliders for input.
*/

//Input variables
var minColumn;
var maxColumn;
var minRow;
var maxRow;
var tabCounter = 0;

//Function declaration for multiplication tables creation
function formTable() {
    //Arbitrarily set limit to 10 saved tabs, can easily alter this if necessary, didnt want to leave it unlimited
    if (tabCounter < 10){
        tabCounter = tabCounter+1;
        $("#multiplication_table").html("");
        //Get raw input as a string
        var minColumnRaw = document.getElementById('user_input1').value;
        var maxColumnRaw = document.getElementById('user_input2').value;
        var minRowRaw = document.getElementById('user_input3').value;
        var maxRowRaw = document.getElementById('user_input4').value;

        //initialize error string as empty
        var errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = "";

        minColumn = parseInt(minColumnRaw, 10);
        maxColumn = parseInt(maxColumnRaw, 10);
        minRow = parseInt(minRowRaw, 10);
        maxRow = parseInt(maxRowRaw, 10);

        //String to hold the html code that will fill the multiplication_table div
        var content = "";

        //Begin creating table by inserting html strings into content
        content += "<table>";
        content += "<thead>";
        content += "<tr>";
        content += "<th></th>";
        //Create top row (column values)
        for (var a = minColumn; a <= maxColumn; a++){
            content += "<th>" + a + "</th>";
        }
        //Closing top row and creating the contents of the table
        content += "</tr>";
        content += "</thead>";
        content += "<tbody>";
        //Iterate through the row values creating the left column (row values)
        for (var b = minRow; b <= maxRow; b++){
            content += "<th scope='row'>"+ b +"</th>";
            //Iterate through creating a table entry for each multiplication table pair (column value * row value)
            for (var c = minColumn; c<= maxColumn; c++){
                content += "<td>" + b*c + "</td>";
            }
            content += "</tr>";
        }
        content += "</tbody>";
        //Create tab header with described labels
        $("#tabs ul").append("<li id=\"head"+ tabCounter +"\"><a href='#tab" + tabCounter + "'>"+ minColumn +" to "+ maxColumn +" by " + minRow + " by " + maxRow + " </a><input id = \"checkbox"+ tabCounter +"\" class = \"checkbox\" type=\"checkbox\"></li>");
        //Create tab content portion placeholder
        $("#tabs").append("<div id='tab" + tabCounter + "'><div id=\"multiplication_table"+ tabCounter +"\"class = \"tableFormat\"></div></div>");
        //Refresh, see https://api.jqueryui.com/tabs/#method-refresh for more details
        $("#tabs").tabs("refresh");
        //Set most recently created tab to active
        $("#tabs").tabs("option", "active", -1);
        //Fill placeholder with actual generated table
        $("#multiplication_table" + tabCounter).html(content); 
    }
    //If 10 tabs are already saved, fill error message and return false
    else {
        var errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = "Maximum amount of saved tables reached! Please delete one to store another!";
        return false;
    }
}

//Delete tab function creates an array of what tabs are checked for delete
//and iterates through their numerical label previously assigned above
//Then it parses the string to return an integer and uses that integer to
//delete all trace of the correct tab.
function deleteTable(){
    //creates array of checked boxes
    var selected = [];
    $('#tabs input:checked').each(function() {
        selected.push($(this).attr('id'));
    });
    for (var i in selected)
    {
        //removes 'checkbox' to return integer
        selected[i] = selected[i].substring(8);
        console.log(selected[i]);
        //deletes each element corresponding with the integer
        $("#head"+selected[i]).remove();
        $("#tab"+selected[i]).remove();
        $("#checkbox"+selected[i]).remove();
        //If tabs not at 0 remove 1 from total
        if(tabCounter>0)
        {
            tabCounter = tabCounter-1;
        }
    }
    //If room is created for more tabs, clear the full message notify users
    if(tabCounter < 10)
    {
        var errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = "";
    }
}

//Select-all checkboxes function (tabs)
function selectAll(){
    $(':checkbox').each(function() {
        this.checked = true;                        
    });
}

//Unselect-all checkboxes function (tabs)
function unselectAll(){
    $(':checkbox').each(function() {
        this.checked = false;                        
    });
}


function validate() {
    $("#input_form").validate({
        //Rule declarations, sets required, range, integer, and ensures Max>Min
        rules: {
            user_input1: {
                required: true,
                range: [-50, 50],
                integer: true
            },
            user_input2: {
                required: true,
                range: [-50, 50],
                integer: true,
                columnMaxGreaterThanEqual: "#user_input1"
            },
            user_input3: {
                required: true,
                range: [-50, 50],
                integer: true
            },
            user_input4: {
                required: true,
                range: [-50, 50],
                integer: true,
                rowMaxGreaterThanEqual: "#user_input3"
            }
        },
        //Broken rules custom messages
        messages: {
            user_input1: {
                number: "Please enter a number between -50 and 50 for the Minimum Column Value entry!",
                required: "No number was entered! A number between -50 and 50 is required for the Minimum Column Value entry!"
            },
            user_input2: {
                number: "Please enter a number between the Minimum Row Value and 50 for the Maximum Column Value entry!",
                required: "No number was entered! A number between the Minimum Row Value and 50 is required for the Maximum Column Value entry!"
            },
            user_input3: {
                number: "Please enter a number between -50 and 50 for the Minimum Row Value entry!",
                required: "No number was entered! A number between -50 and 50 is required for the Minimum Row Value entry!"
            },
            user_input4: {
                number: "Please enter a number between the Minimum Row Value and 50 for the Maximum Row Value entry!",
                required: "No number was entered! A number between the Minimum Row Value and 50 is required for the Maximum Row Value entry!"
            }
        },
        //On valid submit, create table
        submitHandler: function() {
            formTable();
            return false;
        },

        //Place error after the element where the error occurs: https://stackoverflow.com/questions/6545964/jquery-validation-error-placement
        errorElement: "p",
        errorPlacement: function(error, element) {
            error.insertAfter(element.next());
        }
    });
}

//Adding a slider with updating input box values: https://stackoverflow.com/questions/36865066/jquery-slider-with-textbox-input
function validateSlider() {
    //Setting parameters and two way binding
    $("#slider_input1").slider({
        range: "min",
        min: -50,
        max: 50,
        step: 1,
        required: true,
        slide: function(event, ui) {
            //Adjust textbox on slider input
            $("#user_input1").val(ui.value);
            //Force trigger validation on slider input
            $( "#user_input1" ).focus()
            $( "#user_input2" ).focusout()
        }
    });
    //Adjust Slider on textbox input
    $("#user_input1").val($("#slider_input1").slider("value"));
    $("#user_input1").change(function(){
        $("#slider_input1").slider("value", this.value)
    });

    //Setting parameters and two way binding
    $("#slider_input2").slider({
        range: "min",
        min: -50,
        max: 50,
        step: 1,
        animate: 200,
        required: true,
        slide: function(event, ui) {
            //Adjust textbox on slider input
            $("#user_input2").val(ui.value);
            //Force trigger validation on slider input
            $( "#user_input2" ).focus()
            $( "#user_input2" ).focusout()
        }
    });
    //Adjust Slider on textbox input
    $("#user_input2").val($("#slider_input2").slider("value"));
    $("#user_input2").change(function(){
        $("#slider_input2").slider("value", this.value)
    });

    //Setting parameters and two way binding
    $("#slider_input3").slider({
        range: "min",
        min: -50,
        max: 50,
        step: 1,
        animate: 200,
        required: true,
        slide: function(event, ui) {
            //Adjust textbox on slider input
            $("#user_input3").val(ui.value);
            //Force trigger validation on slider input
            $( "#user_input3" ).focus()
            $( "#user_input4" ).focusout()
        }
    });
    //Adjust Slider on textbox input
    $("#user_input3").val($("#slider_input3").slider("value"));
    $("#user_input3").change(function(){
        $("#slider_input3").slider("value", this.value)
    });

    //Setting parameters and two way binding
    $("#slider_input4").slider({
        range: "min",
        min: -50,
        max: 50,
        step: 1,
        animate: 200,
        required: true,
        slide: function(event, ui) {
            //Adjust textbox on slider input
            $("#user_input4").val(ui.value);
            //Force trigger validation on slider input
            $( "#user_input4" ).focus()
            $( "#user_input4" ).focusout()
        }
    });
    //Adjust Slider on textbox input
    $("#user_input4").val($("#slider_input4").slider("value"));
    $("#user_input4").change(function(){
        $("#slider_input4").slider("value", this.value)
    });
};

//This function addresses the automatic validation without clicking into user_input2 and user_input4, not essential, but I thought it made it smoother
function updateMessage() {
    $( "#user_input1" )
    .focusout(function() {
        $( "#user_input2" ).focusin()
        $( "#user_input2" ).blur()
    })

    $( "#user_input3" )
    .focusout(function() {
        $( "#user_input4" ).focusin()
        $( "#user_input4" ).blur()
    })
}


 //From jQuery Validation Plug-in src code (minor alterations): https://github.com/jquery-validation/jquery-validation/blob/master/src/additional/greaterThanEqual.js
 $.validator.addMethod( "rowMaxGreaterThanEqual", function( value, element, param ) {
    var target = $( param );
    
    if ( this.settings.onfocusout && target.not( ".validate-rowMaxGreaterThanEqual-blur" ).length ) {
        target.addClass( "validate-rowMaxGreaterThanEqual-blur" ).on( "blur.validate-rowMaxGreaterThanEqual", function() {
            $( element ).valid();
        } );
    }
    return parseInt(value) >= parseInt(target.val());
}, "A minimum row value must be a valid integer less than or equal to the maximum row value!" );

 //From jQuery Validation Plug-in src code (minor alterations): https://github.com/jquery-validation/jquery-validation/blob/master/src/additional/greaterThanEqual.js
$.validator.addMethod( "columnMaxGreaterThanEqual", function( value, element, param ) {
    var target = $( param );
    if ( this.settings.onfocusout && target.not( ".validate-rowMaxGreaterThanEqual-blur" ).length ) {
        target.addClass( "validate-rowMaxGreaterThanEqual-blur" ).on( "blur.validate-rowMaxGreaterThanEqual", function() {
            $( element ).valid();
        } );
    }
    return parseInt(value) >= parseInt(target.val());
}, "A minimum column value must be a valid integer less than or equal to the maximum column value!" );
