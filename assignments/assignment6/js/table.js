/*
 File: https://mikeqrtll.github.io/assignments/assignment6/js/table.css
 COMP.4610 Assignment No. 6: Using the jQuery Validation Plugin with Your Dynamic Table
 Michael Quaratiello, UMass Lowell Computer Science Student enrolled in COMP.4610 (Formerly 91.61 GUI Programming I), Michael_Quaratiello@student.uml.edu
 Copyright (c) 2020 by Michael Quaratiello. All rights reserved. May be
 freely copied or excerpted for educational purposes with credit to the author.
 Created by Michael Quaratiello on November 6, 2020 at 6:00 PM
 This file provides the JavaScript and jQuery Validation Plugin code for index.html, specifically the creation of the multiplication table based off input from the html form.
*/

//Input variables
var minColumn;
var maxColumn;
var minRow;
var maxRow;

//Function declaration for multiplication tables creation
function formTable() {
  //Get raw input as a string
  var minColumnRaw = document.getElementById('user_input1').value;
  var maxColumnRaw = document.getElementById('user_input2').value;
  var minRowRaw = document.getElementById('user_input3').value;
  var maxRowRaw = document.getElementById('user_input4').value;

  //initialize error string as empty
  document.getElementById('errorMessage').innerHTML = "";

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

  $("#multiplication_table").html(content);
  return false;

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
    
    //On invalid submit, reset previous error message and delete table
    invalidHandler: function() {
        document.getElementById('errorMessage').innerHTML = "";
        document.getElementById('multiplication_table').innerHTML = "";
    },

    //Place error after the element where the error occurs: https://stackoverflow.com/questions/6545964/jquery-validation-error-placement
    errorElement: "p",
    errorPlacement: function(error, element) {
        error.insertAfter(element);
    }
  });
}


 //From jQuery Validation Plug-in src code (minor alterations): https://github.com/jquery-validation/jquery-validation/blob/master/src/additional/greaterThanEqual.js
$.validator.addMethod( "rowMaxGreaterThanEqual", function( value, element, param ) {
    var target = $( param );

    if ( this.settings.onfocusout && target.not( ".validate-greaterThanEqual-blur" ).length ) {
        target.addClass( "validate-greaterThanEqual-blur" ).on( "blur.validate-greaterThanEqual", function() {
            $( element ).valid();
        } );
    }
    return parseInt(value) >= parseInt(target.val());
}, "A minimum row value must be a valid integer less than or equal to the maximum row value!" );

 //From jQuery Validation Plug-in src code (minor alterations): https://github.com/jquery-validation/jquery-validation/blob/master/src/additional/greaterThanEqual.js
$.validator.addMethod( "columnMaxGreaterThanEqual", function( value, element, param ) {
    var target = $( param );

    if ( this.settings.onfocusout && target.not( ".validate-greaterThanEqual-blur" ).length ) {
        target.addClass( "validate-greaterThanEqual-blur" ).on( "blur.validate-greaterThanEqual", function() {
            $( element ).valid();
        } );
    }
    return parseInt(value) >= parseInt(target.val());
}, "A minimum column value must be a valid integer less than or equal to the maximum column value!" );