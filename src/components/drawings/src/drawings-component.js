/**
 * Drawings component.
 */
 
Drawings.GeomDrawComponent = {
    ext_lang: 'geometry_code',
    formats: ['format_geometry_json'],
    struct_support: true,
    factory: function(sandbox) {
        return new Drawings.GeomDrawWindow(sandbox);
    }
};

Drawings.GeomDrawWindow = function(sandbox) {
    this.sandbox = sandbox;

    this.model = new Drawings.Model();
    this.paintPanel = new Drawings.PaintPanel(this.sandbox.container, this.model);
    this.paintPanel.init();

    this.recieveData = function(data) {
        /// @todo Process data - json file data
    };

    // resolve keynodes
    var self = this;
    var scElements = {};
    
    this.needUpdate = false;
    
    this.requestUpdate = function() {
        var updateVisual = function() {
            
            for (var addr in scElements) {
                var obj = scElements[addr];
                
                if (!obj || obj.translated) continue;
                
                // check if object is an arc
                if (obj.data.type & sc_type_arc_pos_const_perm) {
                    
                    var begin = scElements[obj.data.begin];
                    var end = scElements[obj.data.end];

                    // if it connect point set and point, then create the last one
                    if (begin && end && begin.data.addr == self.keynodes.point) {
                        var point = new Drawings.Point((Math.random() - 0.5) * 15.0, (Math.random() - 0.5) * 15.0);
                        self.model.addPoint(point);
                        
                        obj.translated = true;
                    }
                }
            }
            
            /// @todo: Don't update if there are no new elements
            window.clearTimeout(self.structTimeout);
            delete self.structTimeout;
            
            if (self.needUpdate)
                self.requestUpdate();
        };
        
        
        
        self.needUpdate = true;
        if (!self.structTimeout) {
            self.needUpdate = false;
            self.structTimeout = window.setTimeout(updateVisual, 1000);
        }
    }
    
    this.keynodes = new Object();
    
    SCWeb.core.Server.resolveScAddr(['concept_geometric_point',
                                    ], function(keynodes) {
       
        self.keynodes.point = keynodes['concept_geometric_point'];
        
        self.needUpdate = true;
        self.requestUpdate();
    });

    this.eventStructUpdate = function(added, element, arc) {
        window.sctpClient.get_arc(arc).done(function (r) {
            var addr = r.result;
            window.sctpClient.get_element_type(addr).done(function (t) {
                var type = t.result;
                
                var obj = new Object();
                obj.data = new Object();
                
                obj.data.type = type;
                obj.data.addr = addr;
                
                if (type & sc_type_arc_mask) {
                    
                    window.sctpClient.get_arc(addr).done(function (a) {
                        obj.data.begin = a.result[0];
                        obj.data.end = a.result[1];
                        
                        scElements[addr] = obj;
                        self.requestUpdate();
                    });
                    
                } else {
                    scElements[addr] = obj;
                    self.requestUpdate();
                }
            });
        });
    };

    // delegate event handlers
    this.sandbox.eventDataAppend = $.proxy(this.receiveData, this);
    this.sandbox.eventStructUpdate = $.proxy(this.eventStructUpdate, this);

    this.sandbox.updateContent();
};

SCWeb.core.ComponentManager.appendComponentInitialize(Drawings.GeomDrawComponent);
