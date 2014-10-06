$(document).ready(function () {

    var object = $.parseJSON('{"header" : {"text" : "ONLINE GEOMETRY"}, ' +
        '"toolbar" : [{"buttonId" : "point-button", "onclick" : "app.setPointMode()", "image" : "style/images/point.gif"},' +
        ' {"buttonId" :"line-button", "onclick" : "app.setLineMode()", "image" : "style/images/line.gif"},' +
        ' {"buttonId" :"segment-button", "onclick" : "app.setSegmentMode()", "image" : "style/images/segment.jpg"},' +
        ' {"buttonId" :"clear-button", "onclick" : "app.paintPanel.clear()", "image" : "style/images/cl.gif"},' +
        ' {"buttonId" :"web-button", "onclick" : "app.paintPanel.grid()", "image" : "style/images/web.gif"}]}')

    var image, id, onclick;
    for(var i = 0; i < object.toolbar.length; i++) {
        image = object.toolbar[i].image;
        id = object.toolbar[i].buttonId;
        onclick = object.toolbar[i].onclick;
        $(".editor").append('<span class="button" id = "' + id + '" onclick = "' + onclick + '">' +
            '<img src="' + image + '">\
            </span>\
            ')
    }
    $(".board").append('<div id="board" class="jxgbox" style="width: 600px; height: 600px;' +
		'-moz-user-select: none; overflow: hidden; position: relative; margin: auto; margin-bottom: 15px; margin-top: 50px; background: #ffffff">' +
		'<svg style="overflow: hidden; width: 600px; height: 600px;">' + 
		'<defs><filter filterUnits="userSpaceOnUse" height="300%" width="300%" id="jxgbox2_f1">' +
		'<feOffset dy="5" dx="5" in="SourceAlpha" result="offOut"></feOffset>' +
		'<feGaussianBlur stdDeviation="3" in="offOut" result="blurOut"></feGaussianBlur>' +
		'<feBlend mode="normal" in2="blurOut" in="SourceGraphic"></feBlend></filter></defs>' +
		'</svg></div>')
    $(".header").append('<fieldset id = "parameters"><div align = "left"><p style="font-size: 10pt"> Введите значение </p>' +
        '<input id ="p" type = "text" name="param " size="15"><button onclick="app.saveChanges()">Сохранить</button>' +
        '</div></fieldset>')

    app.paintPanel.createBoard();
    var field = document.getElementById("parameters");
    field.style.display = 'none';
});
