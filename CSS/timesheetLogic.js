// global firebase moment //

// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new Train - then update the html + update the database
// 3. Create a way to retrieve Train from the Train Time database.
// 4. Create a way to calculate the next arrival. Using difference between first Train and frequency.
//    Then use moment.js formatting to set difference in minutes.
// 5. Calculate minutes away

$( document ).ready(function() {
// 1. Initialize Firebase
  var config = {
    apiKey: "AIzaSyAMlE3TLrC_jzVAVzge4FCzla5Lwcpwv6U",
    authDomain: "traintime-7bfca.firebaseapp.com",
    databaseURL: "https://traintime-7bfca.firebaseio.com",
    projectId: "traintime-7bfca",
    storageBucket: "traintime-7bfca.appspot.com",
    messagingSenderId: "227799329184"
  };

  firebase.initializeApp(config);

// create a variable to refrence the database
  var database = firebase.database();

// variables to define input from text box

  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = 0;
  var minutesAway = 0;

// 2. Button for adding Train
$("#addTrainBtn").on("click", function(){
  event.preventDefault();

// take user input 
  var trainName = $("#trainNameInput").val().trim();
  var destination = $("#destinationInput").val().trim();
  var firstTrainTime = moment($("#firstTrainTimeInput").val().trim(), "HH:mm").format("X");
  var frequency = $("#frequencyInput").val().trim();

// Setting up the JSON for database
  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency 
  };

  // Uploads Train data to the database
  database.ref().push(newTrain);
  console.log(newTrain);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#trainNameInput").val("");
  $("#destinationInput").val("");
  $("#firstTrainTimeInput").val("");
  $("#frequencyInput").val("");

  // Prevents moving to new page
  return false;
});

//  Created a firebase event listner for adding trains to database and a row in the html when the user adds an entry
database.ref().on("child_added", function(childSnapshot) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().firstTrainTime;
  var frequency = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(destination);
  console.log(firstTrainTime);
  console.log(frequency);

  //Math for turning train arrival time from military time to 12 hours 
  var trainArrival = moment.unix(firstTrainTime).format("hh:mm a");
  console.log(trainArrival);

 //Math to figure out how many minutes till next train
  var timeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log(timeConverted);
  var diffTime = moment().diff(moment(timeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
  var tRemainder = diffTime % frequency;
    console.log(tRemainder);
  var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain); 

//Adds each train's data into the table
  $("#Traintable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + trainArrival + "</td><td>" + tMinutesTillTrain + "</td><td>");

//For error handling
}, function(errorObject){
console.log("The read failed: " + errorObject.code)
});
});
  