$(document).ready(function () {

    
    var config = {
      apiKey: "AIzaSyDilIyI87x61VxJckbJHHFjjaTaFBnEZIQ",
      authDomain: "train-scheduler-45039.firebaseapp.com",
      databaseURL: "https://train-scheduler-45039.firebaseio.com",
      projectId: "train-scheduler-45039",
      storageBucket: "",
      messagingSenderId: "762376079160"
    };
  
    firebase.initializeApp(config);
  
    //database service reference
    var dataRef = firebase.database();
  
    //On click event
    $("#run-search").on("click", function (event) {
      event.preventDefault();
  
     
      train = $("#train-name").val().trim();
      destination = $("#Destination").val().trim();
      time = $("#train-time").val().trim();
      frequency = $("#Frequency").val().trim();
  
      dataRef.ref().push({
        train: train,
        destination: destination,
        time: time,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    });
  
    //Load FirebaseWatcher
    dataRef.ref().on("child_added", function (childSnapshot) {
      var newTrain = childSnapshot.val().train;
      var nextDestination = childSnapshot.val().destination;
      var nextTime = childSnapshot.val().time;
      var updatedFrequency = childSnapshot.val().frequency;
  
      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTimeConverted = moment(nextTime, "HH:mm").subtract(1, "years");
      // Time Difference
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      // Time apart (remainder)
      var tRemainder = diffTime % updatedFrequency;
      // How many minutes until arrival
      var tMinutesTillTrain = updatedFrequency - tRemainder;
      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      //Next arrival of train
      var trainArrival = moment(nextTrain).format("HH:mm");
  
      //Populate table above user input
      $("#current-train-list").append(
        "<tr><td>" + newTrain +
        "</td><td>" + nextDestination +
        "</td><td>" + updatedFrequency +
        "</td><td>" + trainArrival +
        "</td><td>" + tMinutesTillTrain +
        "<td><button class='btn btn-default btn-dark delete-train'key='" + childSnapshot.key + "'  id='delete-train'>X</button></td>" +
        "</td></tr>");
  
      //Delete rows
      $(".delete-train").on("click", function (event) {
        keyref = $(this).attr("key");
        dataRef.ref().child(keyref).remove();
        window.location.reload();
      });
  
      //Field input clear
      $("#train-name, #Destination, #train-time, #Frequency").val("");
      return false;
  
      //Error logging
    }, function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
  });