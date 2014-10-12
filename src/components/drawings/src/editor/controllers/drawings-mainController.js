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
    paintPanel: new Drawings.PaintPanel("paintPanel", new Drawings.Model()),

    setLineMode: function () {
        this.controller = new Drawings.LineController(this.paintPanel, this.model);
    },

    setSegmentMode: function () {
        this.controller = new Drawings.SegmentController(this.paintPanel, this.model);
    },

    setPointMode: function () {
        this.controller = new Drawings.PointController(this.paintPanel, this.model);
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
