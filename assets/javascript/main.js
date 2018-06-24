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

database.ref().on("value", function(snap){
    snapshot = snap.val();
    updateInfo();
});

// Global variables
var snapshot;
var trainIndex = 0;
var name;
var destination;
var firstTrain;
var frequency;
var nextArrival;
var plusDays = 0;
var minutesAway;
var currentTime;


// 1. Get values and validate
function addTrain() {
    event.preventDefault();
    currentTime = (moment().format("HH")*60) + (moment().format("mm")*1);

    // Get values from input fields
    name = $("#name").val();
    destination = $("#destination").val();
    firstTrain = $("#first-train").val();
    frequency = $("#frequency").val();

    // Validation for the firstTrain input field
    if (name === "") {
        alert("Please enter a train name")
    } else {
        if (parseInt(firstTrain) > 2359 || parseInt(firstTrain) < 0) {
            alert("Please enter a number between 0000 and 2359");
        } else if (firstTrain.length !== 4) {
            alert("'First train' should be a 4 digit number");
        } else if (firstTrain.substring(2, 4) > 59) {
            alert("Please enter a valid time");
        } else {
            calculateFirst();
            $("#name").val("");
            $("#destination").val("");
            $("#first-train").val("");
            $("#frequency").val("");
        };
    };
};


// 2. Convert firstTrain value to minutes, then push data to Firebase
function calculateFirst() {
    // firstTrain time in minutes
    firstTrain = (firstTrain.substring(0, 2)*60) + (firstTrain.substring(2, 4)*1);
    calculateNext();
};


// 3. Calculate when the next time will arrive, and update Firebase
function calculateNext() {
    // nextArrival variable = time of first train + ( Math.ceil of the current time divided by the frequency ) minus ( the Math.floor of the first train time divided by the frequency ), times the frequency
    // nextArrival = parseInt(firstTrain) + (Math.ceil(parseFloat((parseInt(currentTime)/parseInt(frequency))) - Math.floor(parseFloat(parseInt(firstTrain)/parseInt(frequency)))) * parseInt(frequency));
    currentTime = (moment().format("HH")*60) + (moment().format("mm")*1);

    if (firstTrain < currentTime) {
        nextArrival = parseInt(firstTrain) + (Math.ceil((parseInt(currentTime) - parseInt(firstTrain)) / parseInt(frequency)) * parseInt(frequency));
        minutesAway = parseInt(nextArrival) - parseInt(currentTime);
        
    } else if (currentTime < firstTrain) {
        // nextArrival = parseInt(firstTrain) + parseInt(frequency) * Math.ceil(parseInt(firstTrain) / parseInt(frequency));
        nextArrival = parseInt(firstTrain);
        minutesAway =  parseInt(nextArrival) - parseInt(currentTime);

    } else if (currentTime === firstTrain) {
        nextArrival = parseInt(firstTrain) + parseInt(frequency);
        minutesAway = parseInt(nextArrival) - parseInt(currentTime);
    };
    // console.log("first before " + firstTrain);
    // console.log("next before " + nextArrival);
    firstTrain = convert(firstTrain);
    nextArrival = convert(nextArrival);
    // console.log("first after " + firstTrain);
    // console.log("next after " + nextArrival);

    database.ref(trainIndex).update({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        nextArrival: nextArrival,
        plusDays: plusDays,
        minutesAway: minutesAway
    });

    // trainIndex++;
};


// 4. Use Firebase data to populate the site's table
function updateInfo() {
    
    $("tbody").empty();
    console.log(snapshot);
    console.log(snapshot.length);
    trainIndex = snapshot.length;
    
    for (let i = 0; i < snapshot.length; i++) {
        var name = $("<td>"+snapshot[i].name+"</td>");
        var destination = $("<td>"+snapshot[i].destination+"</td>");
        var firstTrain = $("<td>"+snapshot[i].firstTrain+"</td>");
        var frequency = $("<td>"+snapshot[i].frequency+"</td>");
        var nextArrival = $("<td>"+snapshot[i].nextArrival+"</td>");
        
        if(snapshot[i].plusDays === 0) {
            plus = $("<td>");
        } else {
            plus = $("<td><span style='font-weight: bold; border-radius: 5px; padding: 3px 5px; background-color: black; color: white; font-size: 0.6rem;'>+" + snapshot[i].plusDays + "</span></td>");
            plusDays = 0;
        };
        var minutesAway = $("<td id='minutes-away'>"+snapshot[i].minutesAway+"</td>");
        var trow = $("<tr id='row" + trainIndex + "'>");
        $("tbody").append(trow).append(name, destination, firstTrain, frequency, nextArrival, plus, minutesAway);        
    };
};


// Convert minutes to hours:minutes format
function convert(t) {
    var hours = Math.floor(parseInt(t/60));
    
    if (hours < 10) {
        hours = "0" + hours;
    } else if (hours > 23) {
        // debugger;
        var hoursNew = parseInt(hours - Math.floor(hours / 24) * 24);
        plusDays = Math.floor(hours / 24);
        // console.log("plusDays " + plusDays);
        
        if (hoursNew < 10) {
            hoursNew = "0" + hoursNew;
        };
    };

    var minutes = t - (hours * 60);

    if (minutes === 0) {
        minutes = "00";
    } else if (minutes < 10) {
    minutes = "0" + minutes;
    };

    if (hours < 23) {
        t = hours + ":" + minutes;
        return t;    
    } else {
        t = hoursNew + ":" + minutes;
        return t;
    };
    
};


function clock() {
    $("#clock").text(moment().format('MMMM D, HH:mm:ss'));
  }
  
  setInterval(clock, 1000);


function scrollToTop() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        $("#go-up").css("display", "flex");
    } else {
        $("#go-up").css("display", "none");
    };
};

window.onscroll = function() {
    scrollToTop();
};