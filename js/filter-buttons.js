function filter_events( type )
{
    var is_hidden = $(".button." + type).attr('data-hidden') == "true";
    if( is_hidden )
    {
        $(".label." + type).parents('.cal-card').show();
        $(".button." + type).attr('data-hidden', 'false');
    }
    else
    {
        $(".label." + type).parents('.cal-card').hide();
        $(".button." + type).attr('data-hidden', 'true');
    }
}
