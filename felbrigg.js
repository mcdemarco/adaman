// This file was created by Felbrigg Herriot and is released under a Creative Commons Attribution NonCommercial ShareAlike 3.0 License//
// You should  place the following lines at the top of your page
//
// var functionCalls = new Array();             // used to record all the calls
// var consecutiveCallCount = 0;                // used to check for consecutive calls    
// var lastFunctionCalled = '';                 // used to check for consecutive calls    
// var consecutiveCallCountAlertThreshold = 50; // an alert is generated if a method is called this many times consecutively
//
// You should also put an empty DIV as show below, somewhere on the page. The 
// contents of the div will be updated after every function call, and will 
// highlight the through put of every function.  If you have a serious loop
// this will not be updated until the consecutive threshold is reached.
//
// 

//
// Place a call to this function at the top of every function that you want to track
// e.g...
// function someFoo () {
//     storeFunctionCalls();
// ...
//

// This function will count every call to the function and display it to screen.
function storeFunctionCalls() {

    // get the name of the function that called this one
    var temp = arguments.callee.caller.toString();
    var fName = temp.substring(temp.indexOf("function") + 8, temp.indexOf("(")) || "anoynmous";
    fName = fName.replace(/^\s+|\s+$/g, '');

    // loop through the existing method calls and update the count             
    var indexOfExistingRow = -1;
    for (var i = 0; i < functionCalls.length; i++) {
        if (functionCalls[i].Name == fName) {
            functionCalls[i].Count++;
            indexOfExistingRow = i;
            break;
        }
    }

    // the method that called this has not done so before so add it into the collection
    if (indexOfExistingRow == -1) {
        functionCalls.push({ "Name": fName, "Count": 1 });
    }

    // update the onscreen display of method calls
    var s = '';
    for (var i = 0; i < functionCalls.length; i++) {
        s += functionCalls[i].Name + ': ' + functionCalls[i].Count + '';
    }
    $('#debugOutput').html(s);

    // checks for the consecutive calls and alert if we've passed the threshold.
    if (fName == lastFunctionCalled) {
        consecutiveCallCount++;
        if (consecutiveCallCount == consecutiveCallCountAlertThreshold) {
            alert(consecutiveCallCount + ' consecutive method calls to the same function :' + fName);
        }
    } else {
        lastFunctionCalled = fName;
        consecutiveCallCount = 0;
    }
}