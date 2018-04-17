
/*
  Displays a notification with the current time. Requires "notifications"
  permission in the manifest file (or calling
  "Notification.requestPermission" beforehand).
*/

//track button
var myNotificationID = null;

//track progress
let progression = 0;

function showme(){

  if(progression == 100){
    progression = 0;
  }
  if(progression < 0){
    progression = 0;
  }
  chrome.notifications.create("notfyId", {
    type:    "progress",
    iconUrl: "nailimg.png",
    title:   "REMINDER",
    message: "It's time to check if you bite your nails !",
    contextMessage: "lvl exp",
    progress: progression,
    buttons: [{
        title: "They are growing!",
        iconUrl: "success.png"
    }, {
        title: "I failed",
        iconUrl: "fail.png"
    }]
}, function(id) {
    myNotificationID = id;
});
}

//function for lvl up
function lvlup(){

  //lvl up notification progress
  chrome.notifications.create("progress100", {
    type:    "progress",
    iconUrl: "nailimg.png",
    title:   "LVL UP!",
    message: "Good job",
    contextMessage: "You made it",
    progress: 100
}, function(id) {
  myNotification100= id;
});
  //lvl up notification image
  chrome.notifications.create("notfyId", {
    type:    "image",
    iconUrl: "nailimg.png",
    title:   "LVL UP!",
    message: "Good job",
    imageUrl: "welldone.png",
}, function(id) {
    myNotificationID = id;
});
}

function lvldown() {
  alert("you went down a lvl");

}

/* Handle the user's clicking 
 * the small 'x' on the top right corner */
chrome.notifications.onClosed.addListener(function(notificationId, byUser) {
  if (byUser == true){
    alert("you are not supposed to close it!")
  }
});

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   // The display activation.
  localStorage.frequency = 1;        // The display frequency, in minutes.
  localStorage.isInitialized = true; // The option initialization.
}

// Test for notification support.
if (window.Notification) {
  // While activated, show notifications at the display frequency.
  if (JSON.parse(localStorage.isActivated)) { showme(); }

  var interval = 0; // The display interval, in minutes.
  setInterval(function() {
    interval++;

    if (
      JSON.parse(localStorage.isActivated) &&
        localStorage.frequency <= interval
    ) {
      showme();
      interval = 0;
    }
  }, 10000); //60000
}

chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
  
  //close notification when click on buttons:
  chrome.notifications.clear("notfyId");

  //check wich button was clicked:
  if (notifId === myNotificationID) {
    
    //on success
    if (btnIdx === 0) {
        //window.open("...");
        progression += 25;
        
        if(progression == 100){
          lvlup();
        }  
    //on Fail
    } else if (btnIdx === 1) {
        progression -= 25;
        
        if(progression < 0){
          lvldown();
        }
    }
  }
  
});