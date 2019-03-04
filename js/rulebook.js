//var rulebookUrl = "https://docs.google.com/document/u/1/d/e/2PACX-1vQNXM7hfNMWKaootLQF0pfkovAcrUfck4Iq0AOIFCsOEhawqfy5BFIU1pEjYKHNUmIrPdXZqJfEFwly/pub#h.36gmfdhvfqic";
var rulebookUrl = "https://docs.google.com/document/u/1/d/e/2PACX-1vRAKLz-JO2h6NRFid9_6iXCSOx1eWqk0Z44rTASgJ-YU6JsH674kcnvgQ32Ltz1HGJQi-QlSckkRVPf/pub";

function getRulesForEvent(name, completion) {
    $.get(rulebookUrl, (rulebookHtml) => {
        var rulebook = $(rulebookHtml);

        // use the Table of Contents as an index
        // find the line corresponding with the given event, and then take the `id` of the linked section header
        var links = rulebook.find("a");
        var found = null;
        var next = null;

        for (var i = 0; i < links.length; i++) {
            if (links[i].innerHTML == name) {
                found = links[i];
                if (i < links.length - 1) {
                    next = links[i + 1];
                }
                break;
            }
        }

        if (found == null) {
            completion(null);
            return;
        }

        var eventId = $(found).attr("href").replace(".", "\\.");
        var nextId = $(next).attr("href").replace(".", "\\.");

        // take all of the elements between the event title and the next event title
        var currentEventTitle = rulebook.find(eventId);
        var nextEventTitle = rulebook.find(nextId)
        var result = $("<div></div>");

        var ruleBookContent = $(currentEventTitle).nextUntil(nextEventTitle);
        result.append(currentEventTitle);
        result.append(ruleBookContent);

        completion(result);
    });
}

function bindRulesEvents() {
    $(".rulesButton").on("click", rulesClick);
}

function rulesClick(event) {
    var button = $(this);
    name = button.attr("event-name");
    getRulesForEvent(name, (result) => {
        $("#rulesModalBody").html(result);
    });
}
