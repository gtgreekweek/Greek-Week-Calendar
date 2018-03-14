function filter_events( type )
{
    var is_hidden = $(".button." + type).attr('data-hidden') == "true";
    if( is_hidden )
    {
        $(".label." + type).parents('.cal-card').show();
        $(".button." + type).attr('data-hidden', 'false');
        $(".button." + type).css('opacity', '1.0');
    }
    else
    {
        $(".label." + type).parents('.cal-card').hide();
        $(".button." + type).attr('data-hidden', 'true');
        $(".button." + type).css('opacity', '0.5');
    }
}
