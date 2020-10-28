/*
 File: https://mikeqrtll.github.io/assignments/assignment5/js/table.css
 COMP.4610 Assignment No. 5: Creating an Interactive Dynamic Table
 Michael Quaratiello, UMass Lowell Computer Science Student enrolled in COMP.4610 (Formerly 91.61 GUI Programming I), Michael_Quaratiello@student.uml.edu
 Copyright (c) 2020 by Michael Quaratiello. All rights reserved. May be
 freely copied or excerpted for educational purposes with credit to the author.
 Created by Michael Quaratiello on October 25, 2020 at 7:00 PM
 This file provides the JavaScript code for index.html, specifically the creation of the multiplication table based off input from the html form.
*/

//Input variables
var minColumn;
var maxColumn;
var minRow;
var maxRow;

//Function declaration for multiplication tables creation
function formTable() {
    //String to hold the html code that will fill the multiplication_table div
    var content = "";

    //Get raw input as a string
    minColumnRaw = document.getElementById("user_input1").value;
    maxColumnRaw = document.getElementById("user_input2").value;
    minRowRaw = document.getElementById("user_input3").value;
    maxRowRaw = document.getElementById("user_input4").value;

    //initialize error string as empty
    document.getElementById('errorMessage').innerHTML = "";

    //The next three IF statements check for empty string inputs, whitespaces, noninteger inputs, and decimals
    //They will return false if invalid input has been provided, meaning the table will not be created or updated.
    //They also will display a corresponding error message that will indicate to the user what needs to be fixed
    if (minColumnRaw == '' || maxColumnRaw == '' || minRowRaw == '' || maxRowRaw == '')
    {
        document.getElementById('errorMessage').innerHTML = "Error: Please fill in all entries with ONLY digits!";
        return false;
    }
    if (/\s/g.test(minColumnRaw) || /\s/g.test(maxColumnRaw) || /\s/g.test(minRowRaw) || /\s/g.test(maxRowRaw))
    {
        document.getElementById('errorMessage').innerHTML = "Error: Please fill in all entries with ONLY digits!";
        return false;
    }
    if (isNaN(minColumnRaw) || minColumnRaw.indexOf(".") != -1 || minColumnRaw.indexOf("e") != -1 ||
        isNaN(maxColumnRaw) || maxColumnRaw.indexOf(".") != -1 || maxColumnRaw.indexOf("e") != -1 ||
        isNaN(minRowRaw) || minRowRaw.indexOf(".") != -1 || minRowRaw.indexOf("e") != -1 ||
        isNaN(maxRowRaw) || maxRowRaw.indexOf(".") != -1 || maxRowRaw.indexOf("e") != -1)
    {
        document.getElementById('errorMessage').innerHTML = "Error: Please enter only digits!"
        return false;
    }

    //The next four assignments set the original variables to the integer value of the input (base 10)
    minColumn = parseInt(minColumnRaw, 10);
    //Input Display testing
    //document.getElementById('display').innerHTML = document.getElementById("user_input1").value;
    maxColumn = parseInt(maxColumnRaw, 10);
    //Input Display testing
    //document.getElementById('display2').innerHTML = document.getElementById("user_input2").value;
    minRow = parseInt(minRowRaw, 10);
    //Input Display testing
    //document.getElementById('display3').innerHTML = document.getElementById("user_input3").value;
    maxRow = parseInt(maxRowRaw, 10);
    //Input Display testing
    //document.getElementById('display4').innerHTML = document.getElementById("user_input4").value;

    //The next four IF statements check to see if all input is within -50 to 50 and swap min and max values if min is greater than max\
    //Upon swapping, the function proceeds in table creation, notifying the user of the action. If the user enters an input that is to big
    //the function will return false and indicated to enter a number within the range
    if ((minColumn > 50) || (minColumn < -50) || (maxColumn > 50) || (maxColumn < -50) ||(minRow > 50) || (minRow < -50) || (maxRow > 50) || (maxRow < -50))
    {
        var tempColumn;
        tempColumn = minColumn;
        minColumn = maxColumn;
        maxColumn = tempColumn;
        document.getElementById('errorMessage').innerHTML = "Entry too big! Please enter numbers from -50 through 50!"
        return false;
    }
    //Both row and column values need swapping
    if ((minColumn > maxColumn) && (minRow > maxRow))
    {
        var tempColumn;
        var tempRow;
        tempColumn = minColumn;
        minColumn = maxColumn;
        maxColumn = tempColumn;

        tempRow = minRow;
        minRow = maxRow;
        maxRow = tempRow;

        document.getElementById('errorMessage').innerHTML = "Swapping entries. Minimum values cannot be greater than Maximum!"
    }
    //Just column values need swapping
    if ((minColumn > maxColumn)  && (minRow <= maxRow))
    {
        var tempColumn;
        tempColumn = minColumn;
        minColumn = maxColumn;
        maxColumn = tempColumn;
        document.getElementById('errorMessage').innerHTML = "Swapping Minimum Column and Maximum Column. Minimum values cannot be greater than Maximum!"
    }
    //Just row values need swapping
    if ((minRow > maxRow) && (minColumn <= maxColumn))
    {
        var tempRow;
        tempRow = minRow;
        minRow = maxRow;
        maxRow = tempRow;
        document.getElementById('errorMessage').innerHTML = "Swapping Minimum Row and Maximum Row. Minimum values cannot be greater than Maximum!"
    }

    //Begin creating table by inserting html strings into content
    content += "<table>"
    content += "<thead>"
    content += "<tr>"
    content += "<th></th>"
    //Create top row (column values)
    for (var a = minColumn; a <= maxColumn; a++){
        content += "<th>" + a + "</th>"
    }
    //Closing top row and creating the contents of the table
    content += "</tr>"
    content += "</thead>"
    content += "<tbody>"
    //Iterate through the row values creating the left column (row values)
    for (var b = minRow; b <= maxRow; b++){
        content += "<th scope='row'>"+ b +"</th>"
        //Iterate through creating a table entry for each multiplication table pair (column value * row value)
        for (var c = minColumn; c<= maxColumn; c++){
            content += "<td>" + b*c + "</td>"
        }
        content += "</tr>"
    }
    content += "</tbody>"
    //Setting the multiplication_table div to the html string generated by formTable()
    document.getElementById('multiplication_table').innerHTML =
                content;
}
