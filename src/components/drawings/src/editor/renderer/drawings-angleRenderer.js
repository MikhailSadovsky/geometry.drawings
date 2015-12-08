/**
 * Angle renderer.
 */

Drawings.AngleRenderer = function (board) {
    this.board = board;
};

Drawings.AngleRenderer.prototype = {

    render: function (angle) {
        var jxgAngle = this._drawAngle(angle);

        if (angle.getValue() != null) {
            this._drawAngleValue(jxgAngle, angle);
        }
    },

    erase: function(angle) {
        var jxgAngle = Drawings.Utils.getJxgObjectById(this.board, angle.getId());

        this._eraseAngle(jxgAngle);
        this._eraseAngleValue(jxgAngle);
    },

    _drawAngle: function (angle) {
        var jxgPoint1 = Drawings.Utils.getJxgObjectById(this.board, angle.point1().getId());
        var jxgPoint2 = Drawings.Utils.getJxgObjectById(this.board, angle.point2().getId());
        var jxgPoint3 = Drawings.Utils.getJxgObjectById(this.board, angle.point3().getId());



        var properties = {
            id: angle.getId(),
            name: angle.getName(),
            straightFirst: false,
            straightLast: false,
            hasInnerPoints: true,
            strokeColor: "Green",
            fillColor: "Orange",
            type:'sector',
            orthoType:'square',
            orthoSensitivity:2,
            radius: 4,
            strokeWidth: 1
        };
        return  this.board.create('angle',  [jxgPoint3, jxgPoint2, jxgPoint1],
            properties);
    },

    _drawAngleValue: function (jxgAngle, angle) {
        var point1 = angle.point1();
        var point2 = angle.point2();
        var point3 = angle.point3();

        var labelX = function () {
            return (point1.getX() + point2.getX() + point3.getX()) / 3 - 2;
        };

        var labelY = function () {
            return (point1.getY() + point2.getY() + point3.getY()) / 3 - 1.5;
        };

        jxgAngle.textLabelValue = this.board.create('text', [labelX, labelY, "angle value = " + angle.getValue()]);
    },

    _eraseAngleValue: function(jxgAngle) {
        if (jxgAngle && jxgAngle.textLabelValue) {
            this.board.removeObject(jxgAngle.textLabelValue);
        }
    },

    _eraseAngle: function(jxgAngle) {
        this.board.removeObject(jxgAngle);
    }
};