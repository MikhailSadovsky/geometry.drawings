/**
 * Segment controller.
 */

Drawings.SegmentController = function(paintPanel, model) {
    this.paintPanel = paintPanel;
    this.model = model;
};

Drawings.SegmentController.prototype = {
    points: [],

    addPoint: function (event) {
        var point;
        var contains = this.paintPanel.containsPoint(event);
        if (!contains) {
            var coordinates = this.paintPanel.getUsrCoordinatesOfMouse(event);
            point = new Drawings.Point(coordinates[0], coordinates[1]);
            point.draw();
        } else {
            var pointName = this.paintPanel.getExistPointName();
            point = this.model.getPoint(pointName);
        }
        this.addSegmentPoint(point);
    },

    addSegmentPoint: function (point) {
        this.points.push(point);
        this.model.points.push(point);

        if (this.points.length == 2) {
            var segment = new Drawings.Segment(this.points[0], this.points[1]);
            segment.draw();

            this.model.addShape(segment);
            this.points.length = 0;
        }
    }
};