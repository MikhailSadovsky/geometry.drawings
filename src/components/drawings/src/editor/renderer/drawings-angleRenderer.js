/**
 * Angle renderer.
 */

Drawings.AngleRenderer = function (board) {
    this.board = board;
};

Drawings.AngleRenderer.prototype = {

    render: function (angle) {
        var jxgAngle = this._drawAngle(angle);

    },

    erase: function(angle) {
        var jxgAngle = Drawings.Utils.getJxgObjectById(this.board, angle.getId());
        this._eraseAngle(jxgAngle);


    },


    _drawValue: function(jxgAngle, angle){
        jxgAngle.name = angle.getName() + ' = ' + angle.getValue();
    },

    _drawAngle: function (angle) {
        var jxgPoint1 = Drawings.Utils.getJxgObjectById(this.board, angle.point1().getId());
        var jxgPoint2 = Drawings.Utils.getJxgObjectById(this.board, angle.point2().getId());
        var jxgPoint3 = Drawings.Utils.getJxgObjectById(this.board, angle.point3().getId());
        var value = Math.round(JXG.Math.Geometry.trueAngle(jxgPoint3,jxgPoint2,jxgPoint1));

        if (angle.getValue()!=null){
            value = angle.getValue();
        }

        var properties = {
            id: angle.getId(),
            name: angle.getName() + ' = ' + value,
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

        return  this.board.create('angle',  [jxgPoint3, jxgPoint2, jxgPoint1],properties);
    },


    _eraseAngle: function(jxgAngle) {
        this.board.removeObject(jxgAngle);
    }
};