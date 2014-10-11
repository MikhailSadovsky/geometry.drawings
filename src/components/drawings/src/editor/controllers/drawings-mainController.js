/**
 * Created by Администратор on 07.12.13.
 */

var app = {

    controller: null,
    drawer: null,
    parametersDoc: null,
    changeElement: null,
    history: [],
    index: 0,
    model: new Model(),
    paintPanel: new PaintPanel("paintpanel", new Model()),

    setLineMode: function () {
        this.clearCtrlPoints();
        this.controller = LineCtrl;
        this.controller.setTooltipText();
        $("#modeInfo").text("Рисование линий");
    },

    setSegmentMode: function () {
        this.clearCtrlPoints();
        this.controller = SegmentCtrl;
        this.controller.setTooltipText();
        $("#modeInfo").text("Рисование отрезков");
    },

    setPointMode: function () {
        this.clearCtrlPoints();
        this.controller = PointCtrl;
        this.controller.setTooltipText();
        $("#modeInfo").text("Рисование точек");
    },

    clearCtrlPoints: function () {
        if (this.controller != null) {
            this.controller.clearPoints();
        }
    },

    executeCommand: function (command) {
        command.execute();
        if (this.index < this.history.length) {
            this.history.length = this.index;
        }
        this.history.push(command);
        this.index++;
    },

    clearHistory: function () {
        if (this.history.length != 0) {
            this.history.length = 0;
            this.index = 0;
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    $("#tooltip").text("Нажмите для нарисования точки");
    $("#tooltip").hide();
    var board = document.getElementById("board");
    app.setPointMode();

    board.addEventListener("mousedown", function (event) {
        var LEFT_MOUSE_BUTTON = 1;
        switch (event.which) {
            case LEFT_MOUSE_BUTTON:
                app.controller.addPoint(event);
        }
    });
    board.addEventListener("mouseleave", function (event) {
        $("#tooltip").hide();
    });
});
