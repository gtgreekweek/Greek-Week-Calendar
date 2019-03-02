var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

var next_event_found = false;

var cached_events = []

var config = {
  apiKey: "AIzaSyCjVbP6rCdOGEdL4yT9L6olvfjjazaLLiU",
  authDomain: "greek-week-28065.firebaseapp.com",
  databaseURL: "https://greek-week-28065.firebaseio.com",
  projectId: "greek-week-28065",
  storageBucket: "greek-week-28065.appspot.com",
  messagingSenderId: "1060345771072"
};
firebase.initializeApp(config);

function getEvents(completion) {
  var database = firebase.database();
  database.ref("calendar").once("value").then((snapshot) => {
    events = []
    snapshot.forEach(childSnapshot => {
      child = childSnapshot.val();
      event = new Event(child)
      events.push(event)
    })

    completion(events)
    cached_events = events
  })
}

function Event(object) {
    this.displayName = object["Display Name"];
    this.rulesName = object["Rulebook Name"];
    this.location = object["Location"]

    this.tags =  object["Tags"].split(",");
    if(this.tags[0] == "")
    {
        this.tags = null;
    }

    this.description = object["Description"];
    //this.hasRuleBookContent = object["Has Rule Book Content?"] == "Yes" ? true : false;
    var dateTimeString = object["Date"] + " " + object["Time"];
    var dateObject     = new Date(dateTimeString);
    this.month         = months[dateObject.getMonth()];
    this.date          = dateObject.getDate();
    var today          = Date.now();
    if(!next_event_found && dateObject > today)
    {
        next_event_found = true;
        this.next_event = true;
    }
    else
    {
        this.next_event = null;
    }
    var hours          = dateObject.getHours();
	var minutes        = dateObject.getMinutes();
	var ampm           = hours >= 12 ? 'pm' : 'am';
	hours              = hours % 12;
	hours              = hours ? hours : 12; // the hour '0' should be '12'
	minutes            = minutes < 10 ? '0'+minutes : minutes;
	this.time          = hours + ':' + minutes + ' ' + ampm;
}

$(document).ready(() => {
    getEvents((events) => {
        cached_events = events
        renderEventsAndScrollToToday()
    });
})

function renderEvents() {
    renderEvents(false, undefined)
}

function renderEventsAndScrollToToday() {
  renderEvents(true, undefined)
}

function renderEventsWithFilter(filter) {
  renderEvents(false, filter)
}

function renderEvents(scrollToToday, selectedFilter) {
  filtered_events = cached_events.filter(function(event) {
      if (selectedFilter != undefined) {
          if (event.tags != null) {
              return event.tags.includes(selectedFilter)
          } else {
              return false
          }
      } else {
          return true
      }
  })

  $.get("eventsTemplate.html", function(template) {
      Mustache.parse(template);
      var rendered = Mustache.render(template, {events: filtered_events});
      $("#eventsList").html(rendered);
      bindRulesEvents();
  }).done( function(){
      if (scrollToToday) {
          $("html, body").animate({scrollTop:$('#next_event').offset().top - 50 }, 1000);
      } else {
          window.scrollTo(0, 0);
      }
  });
  $("#loading_duck").hide();
}
