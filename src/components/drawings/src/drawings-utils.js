/**
 * Utils.
 */

Drawings.Utils = {

    getPointByName: function (points, pointName) {
        return points.filter(function (point) {
            return point.getName() == pointName;
        })[0];
    }
};