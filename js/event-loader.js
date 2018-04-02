var dataDocument = "https://docs.google.com/spreadsheets/d/16xMR7wsN4MetV1v1qKoGqIqv2ucDih2OdC6bB3Lwf88/edit?usp=sharing";

var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

var next_event_found = false;

var cached_events = []

function getEvents(completion) {
    Tabletop.init(
        {
            key: dataDocument,
            simpleSheet: false,
            callback: (data, tabletop) => {
                events = parseObjectIntoEvents(data["Events"].elements)
                completion(events)
                cached_events = events
            },
        })

}

function parseObjectIntoEvents(eventsObject) {
    var events = [];

    for (var i = 0; i < eventsObject.length; i++) {
        events.push(new Event(eventsObject[i]));
    }

    return events;
}

function Event(object) {
    this.name = object["Name"];

    this.location = object["Location"]

    this.tags =  object["Tags"].split(",");
    if(this.tags[0] == "")
    {
        this.tags = null;
    }

    this.description = object["Description"];

    this.hasRuleBookContent = object["Has Rule Book Content?"] == "Yes" ? true : false;

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
}
