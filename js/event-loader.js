var dataDocument = "https://docs.google.com/spreadsheets/d/16xMR7wsN4MetV1v1qKoGqIqv2ucDih2OdC6bB3Lwf88/edit?usp=sharing";

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
    this.name = object["Name"];
    this.location = object["Location"]
    this.tags =  object["Tags"].split(",");
    this.description = object["Description"];
    this.hasRuleBookContent = object["Has Rule Book Content?"] == "Yes" ? true : false;
    var dateTimeString = object["Date"] + " " + object["Time"];
    this.dateTime = new Date(dateTimeString);
}

$(document).ready(() => {
    getEvents((events) => {
        console.log(events);
    })
})