/**
 * Utils.
 */

Drawings.Utils = {

    selectPoints: function (objects) {
        return objects.filter(function (object) {
            return object instanceof Drawings.Point;
        })
    },

    selectSegments: function (objects) {
        return objects.filter(function (object) {
            return object instanceof Drawings.Segment;
        })
    },

    selectTriangles: function (objects) {
        return objects.filter(function (object) {
            return object instanceof Drawings.Triangle;
        })
    },

    getObjectById: function (objects, objectId) {
        return objects.filter(function (object) {
            return object.getId() == objectId;
        })[0];
    },

    randomUUID: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};