// ADD NEW ITEM TO END OF LIST
var endListNode = document.createElement("li");
var endTextNode = document.createTextNode("cream"); 
endListNode.appendChild(endTextNode); 
document.getElementById("page").appendChild(endListNode);     

// ADD NEW ITEM START OF LIST
var startItem = document.createElement("li");
var startTextNode = document.createTextNode("kale");
startItem.appendChild(startTextNode);

var list = document.getElementById("page");
list.insertBefore(startItem, list.childNodes[4]);   

// ADD A CLASS OF COOL TO ALL LIST ITEMS
var listArray = document.getElementsByTagName("li");
var i;
for (i = 0; i < listArray.length; i++) {
    listArray[i].classList.add("cool");
}

// ADD NUMBER OF ITEMS IN THE LIST TO THE HEADING
var header2 = document.getElementsByTagName("h2");
header2[0].insertAdjacentHTML("beforeend", "<span>" + listArray.length + "</span>");