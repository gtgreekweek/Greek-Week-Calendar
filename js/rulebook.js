var rulebookUrl = "https://docs.google.com/document/u/1/d/e/2PACX-1vQNXM7hfNMWKaootLQF0pfkovAcrUfck4Iq0AOIFCsOEhawqfy5BFIU1pEjYKHNUmIrPdXZqJfEFwly/pub#h.36gmfdhvfqic";

function getRulesForEvent(name, completion) {
    $.get(rulebookUrl, (rulebookHtml) => {
        var rulebook = $(rulebookHtml);

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
        var nextId = $(next).attr("href");

        var currentElement = rulebook.find(eventId);
        var result = $("<div></div>");

        var nextElements = $(currentElement).nextUntil("h1");
        result.append(currentElement);
        result.append(nextElements);

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