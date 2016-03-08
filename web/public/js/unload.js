window.onbeforeunload = function(e) {
    var e = e || window.event, message = 'You have unsaved changes!!';
    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = message;
    }
    return message;
};

$(function() {
    /*Los links*/
    $('a').click(function() {
        window.onbeforeunload = null;
    });

    /* Cuando el usuario presiona f5 */
    $(window).keydown(function(event) {
        var key_code = event.keyCode;
        if (key_code === 116) { // User presses F5 to refresh
            window.onbeforeunload = null;
        }
    });
    /*Los formularios*/
    $('form').submit(function() {
        window.onbeforeunload = null;
    });

});

