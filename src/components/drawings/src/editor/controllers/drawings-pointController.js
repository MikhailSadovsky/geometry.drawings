/**
 * Point controller.
 */

Drawings.PointController = function(paintPanel, model) {
    this.paintPanel = paintPanel;
    this.model = model;
};

Drawings.PointController.prototype = {

    addPoint: function (event) {
        if (!this.paintPanel.containsPoint(event)) {
            var coordinates = this.paintPanel.getUsrCoordinatesOfMouse(event);

            var point = new Drawings.Point(coordinates[0], coordinates[1]);
            this.model.points.push(point);

            point.draw();
        }
    }
};