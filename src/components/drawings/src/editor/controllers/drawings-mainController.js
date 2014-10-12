/**
 * Main controller.
 */

Drawings.app = {

    controller: null,
    drawer: null,
    parametersDoc: null,
    changeElement: null,
    history: [],
    index: 0,
    model: new Drawings.Model(),
    paintPanel: new Drawings.PaintPanel("paintpanel", new Drawings.Model()),

    setLineMode: function () {
        this.clearCtrlPoints();
        this.controller = Drawings.LineCtrl;
        this.controller.setTooltipText();
        $("#modeInfo").text("Рисование линий");
    },

    setSegmentMode: function () {
        this.clearCtrlPoints();
        this.controller = Drawings.SegmentCtrl;
        this.controller.setTooltipText();
        $("#modeInfo").text("Рисование отрезков");
    },

    setPointMode: function () {
        this.clearCtrlPoints();
        this.controller = Drawings.PointCtrl;
        this.controller.setTooltipText();
        $("#modeInfo").text("Рисование точек");
    },

    clearCtrlPoints: function () {
        if (this.controller != null) {
            this.controller.clearPoints();
        }
    },

    clearHistory: function () {
        if (this.history.length != 0) {
            this.history.length = 0;
            this.index = 0;
        }
    }
};

document.addEventListener("DOMContentLoaded", function () {
    $("#tooltip").text("Нажмите для нарисования точки");
    $("#tooltip").hide();
    var board = document.getElementById("board");
    Drawings.app.setPointMode();

    board.addEventListener("mousedown", function (event) {
        var LEFT_MOUSE_BUTTON = 1;
        switch (event.which) {
            case LEFT_MOUSE_BUTTON:
                Drawings.app.controller.addPoint(event);
        }
    });
    board.addEventListener("mouseleave", function (event) {
        $("#tooltip").hide();
    });
});
