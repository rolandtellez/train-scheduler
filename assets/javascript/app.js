var config = {
    apiKey: "AIzaSyD1sXfBOjjGaLs4sCVRe-FUsukfxNCB4A0",
    authDomain: "train-scheduler-8c0eb.firebaseapp.com",
    databaseURL: "https://train-scheduler-8c0eb.firebaseio.com",
    projectId: "train-scheduler-8c0eb",
    storageBucket: "train-scheduler-8c0eb.appspot.com",
    messagingSenderId: "1077284894542"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTrainTime = moment($("#first-train-input").val().trim(), "hh:mm").format("X");
    var trainFrequency = $("#frequency-input").val().trim();
  
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      firstTrain: firstTrainTime,
      frequency: trainFrequency
    };

    database.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);
  
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });
  
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrain;
    var trainFrequency = childSnapshot.val().frequency;
  
    console.log(trainName);
    console.log(trainDestination);
    console.log(firstTrainTime);
    console.log(trainFrequency);
  

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var timeRemaining = diffTime % trainFrequency;
    console.log(timeRemaining);

    // Minute Until Train
    var tillNextTrain = trainFrequency - timeRemaining;
    console.log("MINUTES TILL TRAIN: " + tillNextTrain);

    // Next Train
    var nextTrain = moment().add(tillNextTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination),
      $("<td>").text(trainFrequency),
      $("<td>").text(nextTrain),
      $("<td>").text(tillNextTrain)
    );
  
    $("#train-display > tbody").append(newRow);
  });