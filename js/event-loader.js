var dataDocument = "https://docs.google.com/spreadsheets/d/16xMR7wsN4MetV1v1qKoGqIqv2ucDih2OdC6bB3Lwf88/edit?usp=sharing";

var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getEvents(completion) {
    Tabletop.init(
        {
            key: dataDocument,
            simpleSheet: false,
            callback: (data, tabletop) => {
                events = parseObjectIntoEvents(data["Events"].elements)
                completion(events)
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
    this.displayName = object["Display Name"];
    this.rulesName = object["Rulebook Name"];
    this.location = object["Location"]
    this.tags =  object["Tags"].split(",");
    this.description = object["Description"];
    //this.hasRuleBookContent = object["Has Rule Book Content?"] == "Yes" ? true : false;
    var dateTimeString = object["Date"] + " " + object["Time"];
    var dateObject = new Date(dateTimeString);
    this.month = months[dateObject.getMonth()];
    this.date = dateObject.getDate();
}

$(document).ready(() => {
    getEvents((events) => {
        $.get("eventsTemplate.html", function(template) {
            Mustache.parse(template);
            var rendered = Mustache.render(template, {events: events});
            $("#eventsList").html(rendered);
            bindRulesEvents();
        })
    })
})