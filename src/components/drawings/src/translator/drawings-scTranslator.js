/**
 * sc translator.
 */

Drawings.ScTranslator = {

	getKeyNode: function(node_name)	{
		if (!this.hasOwnProperty(node_name) || this[node_name] == null){

			var dfd = new jQuery.Deferred();
			
			var self = this;
			self[node_name] = null;

			window.sctpClient.find_element_by_system_identifier(node_name).done(function(r){
			
				if(r.resCode != SctpResultCode.SCTP_RESULT_OK){
					alert("can't resolve " + node_name);//TODO: remove alert
					//throw "Can't resolve node";
				}	

				self[node_name] = r.result;

				dfd.resolve(self[node_name]);				

			}).fail(function () {
				self[node_name] = null;
				dfd.resolve(self[node_name]);
		    });

			return dfd.promise();

		}
	},
	
	getKeyNodes: function(){
	
		var dfd = new jQuery.Deferred();
		var my_array = [];
		var self = this;
		
		my_array.push(this.getKeyNode("concept_segment"));
		my_array.push(this.getKeyNode("nrel_side"));
		my_array.push(this.getKeyNode("concept_triangle"));
		my_array.push(this.getKeyNode("concept_geometric_point"));//?
		my_array.push(this.getKeyNode("concept_line"));
		my_array.push(this.getKeyNode("nrel_boundary_point"));
		my_array.push(this.getKeyNode("nrel_inclusion"));
		my_array.push(this.getKeyNode("nrel_vertex"));
		my_array.push(this.getKeyNode("nrel_length"));
		my_array.push(this.getKeyNode("concept_value"));
		my_array.push(this.getKeyNode("nrel_area"));
		my_array.push(this.getKeyNode("concept_square"));
		my_array.push(this.getKeyNode("big_red_node")); // 14
		
		$.when.apply($, my_array).done(function (){
			dfd.resolve();
		
		}).fail(function () {
		dfd.reject();
		});
		
		return dfd.promise();
	},

    putPoint: function (point) {

		var dfd = new jQuery.Deferred();
			
		if (point.hasOwnProperty("sc_addr") && point.sc_addr != null){
			dfd.resolve(point.sc_addr);
			return dfd.promise();
		}
			
		var self = this;
		point.sc_addr = null;

		window.sctpClient.create_node(sc_type_node | sc_type_const).done(function (r){
			point.sc_addr = r.result;

			window.sctpClient.create_arc(sc_type_arc_pos_const_perm, r.result, self.big_red_node).done(function (){
				dfd.resolve(r.result);
			}).fail(function(){
				point.sc_addr = null;
				dfd.reject();
				alert("create arc for point failed");
			});
		}).fail(function(){
			point.sc_addr = null;
			dfd.reject();
			alert("create node for point failed");
		});
		
    return dfd.promise();
    },

	pushPoints: function(points){
	
		var dfd = new jQuery.Deferred();
		var my_array = [];
		var self = this;
		for (t in points){
			my_array.push(this.putPoint(points[t]));
		};

		$.when.apply($, my_array).done(function (){
			dfd.resolve();
		
		}).fail(function () {
			dfd.reject();
		});
		
		return dfd.promise();
	},
    // temporary solution for keeping KB clean
    wipeOld: function() {
        
		//find 'big_red_node' that contains all new data and wipe out contents - deleting won't work yet =\
		
		var self = this;
		var dfd = new jQuery.Deferred();
/*	
		window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A,
                                      [
                                          self.big_red_node,
                                          sc_type_arc_pos_const_perm,
                                          sc_type_node | sc_type_const
                                      ])
    	.done(function (res) {
        	var langs = [];
        
        	for (r in res.result) {
        	    langs.push(res.result[r][2]);
        	}
        //TODO: add deleting when it will work
		
		dfd.resolve(langs);
       
    	}).fail(function () {
			alert("fail in wipeOld");
        	dfd.resolve();
    	});
*/
		dfd.resolve();
		return dfd.promise();
    },

    putShape: function (shape) {
        return "sc_addr";
    },

    putModel: function (model) {
	var cleanup = this.wipeOld;

	var pushPts = this.pushPoints;
	var self = this;

	var dfd = this.getKeyNodes().done(function () {
		//cleanup.call(self);

		//foreach point add point-defined nodes and arcs
		return pushPts.call(self, model.points);
		
	}).done(function (){
		//foreach shape add shape-defined nodes and arcs

		for (var i = 0; i < model.points.length; i++) 
		{
			var el = model.points[i];
			document.getElementById(model.paintPanel._getJxgObjectById(el.getId()).rendNode.id).setAttribute('sc_addr', el.sc_addr);
		}
//		alert(model.points.length + " points translated; ");
        
	});		
	
    }    

};
