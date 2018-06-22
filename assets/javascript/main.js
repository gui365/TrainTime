// Initialize Firebase
var config = {
    apiKey: "AIzaSyBRe2JkH90ADaPx7aKSM9Z85t50i5axlrE",
    authDomain: "traintime-78834.firebaseapp.com",
    databaseURL: "https://traintime-78834.firebaseio.com",
    projectId: "traintime-78834",
    storageBucket: "",
    messagingSenderId: "963747419207"
};

firebase.initializeApp(config);

var database = firebase.database();

// Global variables
var trainIndex = 0;
var name;
var destination;
var firstTrain;
var frequency;
var nextArrival;
var minutesAway;
var currentTime = (moment().format("HH")*60) + (moment().format("mm")*1); 


// 1. Get values and validate
function addTrain() {
    event.preventDefault();

    // Get values from input fields
    name = $("#name").val();
    destination = $("#destination").val();
    firstTrain = $("#first-train").val();
    frequency = $("#frequency").val();

    // Validation for the firstTrain input field
    if (parseInt(firstTrain) > 2359 || parseInt(firstTrain) < 0) {
        alert("Please enter a number between 0000 and 2359");
    } else if (firstTrain.length !== 4) {
        alert("'First train' should be a 4 digit number");
    } else {
        calculateFirst();
    }
};


// 2. Convert firstTrain value to minutes, then push data to Firebase
function calculateFirst() {
    // firstTrain time in minutes
    firstTrain = (firstTrain.substring(0, 2)*60) + (firstTrain.substring(2, 4)*1);
    
    database.ref(trainIndex).update({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    });

    calculateNext();
};


// 3. Calculate when the next time will arrive, and update Firebase
function calculateNext() {
    // nextArrival variable = time of first train + ( Math.ceil of the current time divided by the frequency ) minus ( the Math.floor of the first train time divided by the frequency ), times the frequency
    nextArrival = parseInt(firstTrain) + (Math.ceil(parseFloat((parseInt(currentTime)/parseInt(frequency))) - Math.floor(parseFloat(parseInt(firstTrain)/parseInt(frequency)))) * parseInt(frequency));
    minutesAway = parseInt(nextArrival) - parseInt(currentTime);

    // console.log("First train " + firstTrain);
    // console.log("Current time " + currentTime);
    // console.log("Next train " + nextArrival);
    // console.log("Departs in " + minutesAway);

    database.ref(trainIndex).update({
        nextArrival: nextArrival,
        minutesAway: minutesAway
    });

    trainIndex++;
    updateInfo();
};


// 4. Use Firebase data to populate the site's table
function updateInfo() {
    database.ref().on("child_added", function(snap){
        // console.log(snap);
        // console.log(snap.val());
        // console.log(snap.val()[0].name);
        // console.log(snap.val()["0"]);
        $("tbody").append($("<tr>").append($("<td>"+snap.val()[trainIndex].name+"</td>")));
        console.log(trainIndex);
        
    });
}


database.ref("/trains").on("value", function(snap){
    // console.log(snap.val());
    
});