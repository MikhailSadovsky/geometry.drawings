/**
 * Line controller.
 */

Drawings.LineController = function (paintPanel, model) {
    this.paintPanel = paintPanel;
    this.model = model;
};


Drawings.LineController.prototype = {
    points: [],

    addPoint: function (event) {
        var point;

        if (!this.paintPanel.containsPoint(event)) {
            var coordinates = this.paintPanel.getUsrCoordinatesOfMouse(event);
            point = new Drawings.Point(coordinates[0], coordinates[1]);
            point.draw();
        }
        else {
            var pointName = this.paintPanel.getExistPointName();
            point = this.model.getPoint(pointName);
        }

        this.addLinePoint(point);
    },

    addLinePoint: function (point) {
        this.model.points.push(point);

        this.points.push(point);

        if (this.points.length == 2) {
            var line = new Drawings.Line(this.points[0], this.points[1]);
            line.draw();
            this.model.addShape(line);
            this.points.length = 0;
        }
    }
};