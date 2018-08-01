
let progression = 0;
let lvl = 0;
var myNotificationID = null;

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.isActivated = true; // The display activation.
  localStorage.frequency = 1; // The display frequency, in minutes.
  localStorage.isInitialized = true; // The option initialization.
}

// Test for notification support.
if (window.Notification) {
  // While activated, show notifications at the display frequency.
  if (JSON.parse(localStorage.isActivated)) {
    chrome.storage.sync.get("store", function(data) {
      //continue only if data.store is not undefined!
      if (typeof data.store !== "undefined") {
        progression = data.store;
      }
    });
    chrome.storage.sync.get("nivel", function(lvlcheck) {
      if (typeof lvlcheck.nivel !== "undefined") {
        lvl = lvlcheck.nivel;
      }
    });
  }
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
  }, 60000); //60000 when not in test mode
}

/*
*   FUNCTIONS AND LISTENERS
*/

//Function to show nail progress and buttons
function showme(){
  console.log(localStorage.frequency);
  chrome.notifications.create("notfyId", {
    type:    "progress",
    iconUrl: "img/nailimg.png",
    title:   "Be honest with yourself!",
    message: "It's time to check if you were biting your nails!",
    contextMessage: "lvl exp: "+ progression + "%",
    progress: Math.ceil(progression),
    buttons: [{
        title: "I'm keeping them out off my mouth!",
        iconUrl: "img/success.png"
    }, {
        title: "I failed and bited them",
        iconUrl: "img/fail.png"
    }]
}, function(id) {
    myNotificationID = id;
  });
}

//function when lvl up!
function lvlup() {
  lvl++;
  chrome.storage.sync.set({ nivel: lvl }, function() {});

  //notification progress 100%
  chrome.notifications.create("progress100", {
    type:    "progress",
    iconUrl: "img/welldone.png",
    title:   "LVL UP!",
    message: "Good job",
    contextMessage: "You made it to lvl: "+lvl+", keep resisting!",
    progress: 100
  }, function(id) {
      myNotification100= id;
    });

}

//Function when lvl down
function lvldown() {
  lvl--;
  chrome.storage.sync.set({ "nivel": lvl }, function(){
  });

  chrome.notifications.create("lvldown", {
    type:    "basic",
    iconUrl: "img/fail.png",
    title:   "LVL DOWN!",
    message: "Come on bud, your nails are gross!",
  }, function(id) {
    myNotification100= id;
  });
}

//Listener when user click notification buttons
chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
  //close notification when click on buttons:
  chrome.notifications.clear("notfyId");

  //check wich button was clicked:
  if (notifId === myNotificationID) {
    //on success
    if (btnIdx === 0) {
      
      if(lvl === 0){
        progression += 100;
      }else if(lvl >0 && lvl <= 5) {
        progression += 50;
      }else if(lvl >5 && lvl <= 15) {
        progression += 33.3;
      }else if(lvl>15 && lvl<= 30) {
        progression += 25;
      }else {
        progression += 20;
      }
      
      if (progression > 99) {
        lvlup();
        progression = Math.ceil(progression) - 100;
      }
    }
    //on Fail
    else if (btnIdx === 1) {
      progression -= 25;
      if (progression < 0) {
        lvldown();
        progression = 75;
      }
    }
    //Set storage
    chrome.storage.sync.set({ store: progression }, function() {});
  }
});
