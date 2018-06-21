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

// Get values from input fields and store in Firebase
var name = $("#name").val();
var destination = $("#destination");
var firstTrain = $("#first-train");
var frequency = $("#frequency");

function addTrain() {
    console.log("hi");
    
}