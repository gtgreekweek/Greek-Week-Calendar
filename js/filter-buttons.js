function filter_events( type )
{ 
  
    // update the buttons
    var is_hidden = $(".button." + type).attr('data-hidden') == "true";

    if( is_hidden )
    {
        // rerender the events without a filter
        renderEvents()
      
        // Shows all other cards
        $(".label").parents('.cal-card').show();
        $(".button").attr('data-hidden', 'false');
        $(".button").css('opacity', '1.0');
    }
    else
    {
      
        // rerender the events with a filter
        renderEventsWithFilter(type)
      
        // Hides all other buttons first
        $(".label").parents('.cal-card').hide();
        $(".button").attr('data-hidden', 'false');
        $(".button").css('opacity', '0.5');

        // Shows just this type
        $(".label." + type).parents('.cal-card').show();
        $(".button." + type).attr('data-hidden', 'true');
        $(".button." + type).css('opacity', '1.0');
    }
}
