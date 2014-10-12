/**
 * Line controller.
 */

Drawings.LineCtrl = {

    points: [],

    addPoint: function (event) {
        var point;
        var contains = Drawings.app.paintPanel.containsPoint(event);
        if (!contains) {
            var coordinates = Drawings.app.paintPanel.getUsrCoordinatesOfMouse(event);
            point = new Drawings.Point(coordinates[0], coordinates[1]);
            point.draw();
        } else {
            var pointName = Drawings.app.paintPanel.getExistPointName();
            point = Drawings.app.paintPanel.model.getPoint(pointName);
        }
        this.addLinePoint(point);
        this.setTooltipText();
    },

    addLinePoint: function (point) {
        Drawings.app.paintPanel.model.points.push(point);
        this.points.push(point);
        if (this.points.length == 2) {
            var line = new Drawings.Line(this.points[0], this.points[1]);
            line.draw();
            Drawings.app.paintPanel.model.addShape(line);
            this.points.length = 0;
        }
    },

    clearPoints: function () {
        this.points.length = 0;
    },

    setTooltipText: function () {
        var info = "";
        switch (this.points.length) {
            case 0 :
                info = "Установите начальную точку линии";
                break;
            case 1:
                info = "Установите конечную точку линии";
        }
        $("#tooltip").text(info);
    }
};