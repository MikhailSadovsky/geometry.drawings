/**
 * sc translator.
 */
Drawings.ScTranslator = {
    getKeyNode: function (node_name) {
        if (!this.hasOwnProperty(node_name) || this[node_name] == null) {
            var dfd = new jQuery.Deferred();
            var self = this;
            self[node_name] = null;
            window.sctpClient.find_element_by_system_identifier(node_name)
                .done(function (r) {
// if(r.resCode != SctpResultCode.SCTP_RESULT_OK){
                    if (r == null) {
                        alert("can't resolve " + node_name);// TODO: remove
// alert
                    }
                    self[node_name] = r;
                    dfd.resolve(self[node_name]);
                }).fail(function () {
                    self[node_name] = null;
                    dfd.resolve(self[node_name]);
                });
            return dfd.promise();
        }

    },
    getKeyNodes: function () {
        var dfd = new jQuery.Deferred();
        var my_array = [];
        var self = this;
        my_array.push(this.getKeyNode("concept_quantity"));
        my_array.push(this.getKeyNode("concept_segment"));
        my_array.push(this.getKeyNode("nrel_side"));
        my_array.push(this.getKeyNode("concept_triangle"));
        my_array.push(this.getKeyNode("concept_circle"));
        my_array.push(this.getKeyNode("concept_geometric_point"));// ?
        my_array.push(this.getKeyNode("concept_straight_line"));
        my_array.push(this.getKeyNode("nrel_boundary_point"));
        my_array.push(this.getKeyNode("nrel_inclusion"));
        my_array.push(this.getKeyNode("nrel_vertex"));
        my_array.push(this.getKeyNode("nrel_radius"));
        my_array.push(this.getKeyNode("nrel_system_identifier"));
        my_array.push(this.getKeyNode("nrel_length"));
        my_array.push(this.getKeyNode("nrel_value"));
        my_array.push(this.getKeyNode("nrel_area"));
        my_array.push(this.getKeyNode("concept_square"));
        my_array.push(this.getKeyNode("big_red_node"));
        my_array.push(this.getKeyNode("sc_garbage")); // 15
        $.when.apply($, my_array).done(function () {
            dfd.resolve();
        }).fail(function () {
            dfd.reject();
        });
        return dfd.promise();
    },

    /*
     Add relation or attribute construction.
     All parameters must be sc_addr
     */
    addFiveConstruction: function (start_el, end_el, relOrAttr, arc_type) {
        window.sctpClient.create_arc(
            arc_type, start_el, end_el).done(function (res) {
                window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, relOrAttr, res);
            });
    },

    /*
     Add relation or attribute construction and put all arcs into base_el.
     All parameters must be sc_addr.
     */
    addFiveConstructionIntoBase: function (start_el, end_el, relOrAttr, base_el, arc_type) {
        window.sctpClient.create_arc(
            arc_type, start_el, end_el).done(function (res) {
                window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, relOrAttr, res).done(function (res1) {
                        window.sctpClient.create_arc(
                            sc_type_arc_pos_const_perm, base_el, res1);
                    });
                window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, base_el, res);
                window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, base_el, relOrAttr);
            });
    },

    putPoint: function (point) {
        var dfd = new jQuery.Deferred();
        if (point.hasOwnProperty("sc_addr") && point.sc_addr != null) {
            dfd.resolve(point.sc_addr);
            return dfd.promise();
        }
        var self = this;
        point.sc_addr = null;
        window.sctpClient.create_node(sc_type_node | sc_type_const).done(
            function (r) {
                point.sc_addr = r;
                if ("" != point.name) {
                    window.sctpClient.create_link().done(function (res) {
                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.big_red_node, res);
                        window.sctpClient.set_link_content(res, point.name);
                        self.addFiveConstructionIntoBase(r, res, self.nrel_system_identifier, self.big_red_node,
                            sc_type_arc_common | sc_type_const);
                    });
                }
                var arc1 = window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, self.big_red_node, r);
                var arc2 = window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, self.concept_geometric_point, r);

                arc2.done(function (res) {
                    window.sctpClient.create_arc(
                        sc_type_arc_pos_const_perm, self.big_red_node, res);
                })

                var arc3 = window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, self.big_red_node, self.concept_geometric_point);
                $.when(arc1, arc2, arc3).done(function () {
                    dfd.resolve(r);
                });
            }).fail(function () {
                point.sc_addr = null;
                dfd.reject();
                alert("1) create node for point failed");
            });
        return dfd.promise();
    },
// /
    putShape: function (shape) {
        var dfd = new jQuery.Deferred();
        if (shape.hasOwnProperty("sc_addr") && shape.sc_addr != null) {
            dfd.resolve(shape.sc_addr);
            return dfd.promise();
        }
        var self = this;
        shape.sc_addr = null;
        window.sctpClient.create_node(sc_type_node | sc_type_const).done(
            function (r) {
                var points = shape.points;
                shape.sc_addr = r;

                var shapeType = self.concept_geometric_point;
                if (shape.className == 'Segment') {
                    shapeType = self.concept_segment;
                    for (var i = 0; i < points.length; i++) {
                        self.addFiveConstructionIntoBase(r, points[i].sc_addr, self.nrel_boundary_point,
                            self.big_red_node, sc_type_arc_common | sc_type_const);
                    }

                }
                if (shape.className == 'Line') {
                    shapeType = self.concept_straight_line;
                    for (var i = 0; i < points.length; i++) {
                        self.addFiveConstruction(r, points[i].sc_addr, self.big_red_node, sc_type_arc_pos_const_perm);
                    }
                }
                if (shape.className == 'Circle') {
                    shapeType = self.concept_circle;
                    if (shape.radius) {
                        self.addFiveConstructionIntoBase(r, shape.radius.sc_addr, self.nrel_radius,
                            self.big_red_node, sc_type_arc_common | sc_type_const);
                    }
                }
                if (shape.className == 'Triangle') {
                    shapeType = self.concept_triangle;
                    for (var i = 0; i < points.length; i++) {
                        self.addFiveConstructionIntoBase(r, points[i].sc_addr, self.nrel_vertex,
                            self.big_red_node, sc_type_arc_common | sc_type_const);
                    }
                    if (!shape.hasOwnProperty('shapes')) {
                        shape.shapes = [];
                        shape.shapes[0] = shape.segment1;
                        shape.shapes[1] = shape.segment2;
                        shape.shapes[2] = shape.segment3;
                    }

                    for (var i = 0; i < shape.shapes.length; i++) {
                        console.log('shape.shapes[i].sc_addr = ' + shape.shapes[i].sc_addr);
                        self.addFiveConstructionIntoBase(r, shape.shapes[i].sc_addr, self.nrel_side,
                            self.big_red_node, sc_type_arc_common | sc_type_const);
                    }

                }

                if ("" != shape.name) {
                    window.sctpClient.create_link().done(function (res) {
                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, self.big_red_node, res);
                        window.sctpClient.set_link_content(res, shape.name);
                        self.addFiveConstructionIntoBase(r, res, self.nrel_system_identifier, self.big_red_node,
                            sc_type_arc_common | sc_type_const);
                    });
                }

                var arc1 = window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, self.big_red_node, r);

                var arc2 = window.sctpClient
                    .create_arc(sc_type_arc_pos_const_perm, shapeType, r);

                arc2.done(function (result) {
                    window.sctpClient.create_arc(
                        sc_type_arc_pos_const_perm, self.big_red_node, result);
                });

                var arc3 = window.sctpClient.create_arc(
                    sc_type_arc_pos_const_perm, self.big_red_node, shapeType);

                $.when(arc1, arc2, arc3).done(function () {
                    console.log('sc_addr shape= ', r);
                    dfd.resolve(r);
                });
            }).fail(function () {
                shape.sc_addr = null;
                dfd.reject();
                alert("1) create node for shape failed");
            });

        dfd.resolve(shape.sc_addr);
        return dfd.promise();
    },
// /
    pushPoints: function (points) {
        var dfd = new jQuery.Deferred();
        var my_array = [];
        var self = this;
        for (t in points) {
            my_array.push(this.putPoint(points[t]));
        }

        $.when.apply($, my_array).done(function () {
            dfd.resolve();
        }).fail(function () {
            dfd.reject();
        });
        return dfd.promise();
    },
    pushShapes: function (shapes) {
        var dfd = new jQuery.Deferred();
        var my_array1 = [];
        var self = this;
        //put segments first
        for (t in shapes) {
            if (shapes[t].className == 'Segment')
                my_array1.push(this.putShape(shapes[t]));
        }

        $.when.apply($, my_array1).done(function () {
            //then other shapes
            var my_array2 = [];

            for (t in shapes) {
                if (shapes[t].className != 'Segment')
                    my_array2.push(self.putShape(shapes[t]));
            }

            $.when.apply($, my_array2).done(function () {
                dfd.resolve();
            }).fail(function () {
                dfd.reject();
            });
        }).fail(function () {
            dfd.reject();
        });
        return dfd.promise();
    },
// temporary solution for keeping KB clean
    wipeOld: function () {
// find 'big_red_node' that contains all new data and wipe out contents
// - deleting won't work yet =\
        var self = this;
        var dfd = new jQuery.Deferred();
        window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A, [
            self.big_red_node, sc_type_arc_pos_const_perm, sc_type_node |
            sc_type_const]).done(function (res) {
            for (r in res.result) {
//langs.push(res.result[r][2]);
                window.sctpClient.create_arc(sc_type_arc_pos_const_perm,
                    self.sc_garbage, r[2]);
            } //TODO: add deleting when it will work
            dfd.resolve();
        }).fail(function () {
            //alert("fail in wipeOld");
            dfd.resolve();
        });
//dfd.resolve();
        return dfd.promise();
    },

    viewBasedKeyNode: function () {
        var addr;
        SCWeb.core.Server.resolveScAddr(['big_red_node',
        ], function (keynodes) {
            addr = keynodes['big_red_node'];

            SCWeb.core.Server.resolveScAddr(["ui_menu_view_full_semantic_neighborhood"],

                function (data) {
                    console.log("data = " + data["ui_menu_view_full_semantic_neighborhood"]);
                    var cmd = data["ui_menu_view_full_semantic_neighborhood"];

                    SCWeb.core.Server.doCommand(cmd,
                        [addr], function (result) {
                            if (result.question != undefined) {
                                SCWeb.ui.WindowManager.appendHistoryItem(result.question);
                            }
                        });
                });
        });


    },

    putModel: function (model) {
        var cleanup = this.wipeOld;
        var pushPts = this.pushPoints;
        var pushSh = this.pushShapes;
        var self = this;
        var dfd = this.getKeyNodes();
        dfd.done(function () {
            return cleanup.call(self);
        });
        dfd.done(function () {
            return pushPts.call(self, model.points).done(
                function () {
// foreach points add point-defined nodes and arcs
                    for (var i = 0; i < model.points.length; i++) {
                        var el = model.points[i];
                        document.getElementById(
                            model.paintPanel._getJxgObjectById(el
                                .getId()).rendNode.id)
                            .setAttribute('sc_addr', el.sc_addr);
                    }
                });
        });
        dfd.done(function () {
            return pushSh.call(self, model.shapes).done(
                function () {
// foreach shapes add shape-defined nodes and arcs
                    for (var i = 0; i < model.shapes.length; i++) {
                        var el = model.shapes[i];
                        document.getElementById(
                            model.paintPanel._getJxgObjectById(el
                                .getId()).rendNode.id)
                            .setAttribute('sc_addr', el.sc_addr);
                    }
                });
        });
    }
};
