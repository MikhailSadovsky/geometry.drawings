/**
 * Point controller.
 */

Drawings.PointCtrl = {

    addPoint: function (event) {
        var point;
        var contains = Drawings.app.paintPanel.containsPoint(event);
        if (!contains) {
            var coordinates = Drawings.app.paintPanel.getUsrCoordinatesOfMouse(event);
            point = new Drawings.Point(coordinates[0], coordinates[1]);
            Drawings.app.paintPanel.model.points.push(point);
            point.draw();
        }
    },

    clearPoints: function () {
    },

    setTooltipText: function () {
        $("#tooltip").text("Нажмите для нарисования точки");
    }
};