$(document).ready(function () {

    var container = $('#container');

    // initialize toolbar markup
    container.append('<div id="toolbar" class="toolbar"></div>');

    var toolbar = $('#toolbar');
    toolbar.append('<div id="pointButton" class="button point"></div>');
    toolbar.append('<div id="lineButton" class="button line"></div>');
    toolbar.append('<div id="segmentButton" class="button segment"></div>');
    toolbar.append('<div id="clearButton" class="button clear"></div>');

    $('#pointButton').click(function () {
        app.setPointMode();
    });

    $('#lineButton').click(function () {
        app.setLineMode();
    });

    $('#segmentButton').click(function () {
        app.setSegmentMode();
    });

    $('#clearButton').click(function () {
        app.paintPanel.clear();
    });

    // initialize board
    container.append('<div id="board" class="jxgbox"></div>');

    // initialize paint panel
    app.paintPanel.createBoard();
});
