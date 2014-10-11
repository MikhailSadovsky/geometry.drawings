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
        Drawings.app.setPointMode();
    });

    $('#lineButton').click(function () {
        Drawings.app.setLineMode();
    });

    $('#segmentButton').click(function () {
        Drawings.app.setSegmentMode();
    });

    $('#clearButton').click(function () {
        Drawings.app.paintPanel.clear();
    });

    // initialize board
    container.append('<div id="board" class="jxgbox"></div>');

    // initialize paint panel
    Drawings.app.paintPanel.createBoard();
});
