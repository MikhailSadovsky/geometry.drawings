var SegmentCtrl = {

    points: [],

    addPoint: function (event) {
        var point;
        var contains = PaintPanel.containsPoint(event);
        if(!contains) {
            var coordinates = PaintPanel.getUsrCoordinatesOfMouse(event);
            point = new ModelPoint(coordinates[0], coordinates[1]);
            point.draw();
        } else {
            var pointName = PaintPanel.getExistPointName();
            point = Model.getPoint(pointName);
        }
        this.addSegmentPoint(point);
        this.setTooltipText();
    },

    addSegmentPoint : function(point) {
        this.points.push(point);
        if(this.points.length == 2) {
            var segmentPoints = [this.points[0], this.points[1]];
            var segment = new Segment(segmentPoints);
            segment.draw();
            Model.addShape(segment)
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
                info = "Установите начальную точку отрезка";
                break;
            case 1:
                info = "Установите конечную точку отрезка";
        }
        $("#tooltip").text(info);
    }
};
