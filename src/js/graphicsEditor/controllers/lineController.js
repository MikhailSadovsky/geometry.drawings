/**
 * Created by Администратор on 09.12.13.
 */

var LineCtrl = {

    points: [],

    addPoint: function (event) {
        var point;
        var contains = app.paintPanel.containsPoint(event);
        if(!contains) {
            var coordinates = app.paintPanel.getUsrCoordinatesOfMouse(event);
            point = new Point(coordinates[0], coordinates[1]);
            point.draw();
        } else {
            var pointName = app.paintPanel.getExistPointName();
            point = app.paintPanel.model.getPoint(pointName);
        }
        this.addLinePoint(point);
        this.setTooltipText();
    },

    addLinePoint : function(point) {
        app.paintPanel.model.points.push(point);
        this.points.push(point);
        if(this.points.length == 2) {
            var linePoints = [this.points[0], this.points[1]];
            var line = new Line(linePoints);
            line.draw();
            app.paintPanel.model.addShape(line)
            this.points.length = 0;
        }
    },

    clearPoints: function () {
        this.points.length = 0;
    },

    setTooltipText : function() {
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