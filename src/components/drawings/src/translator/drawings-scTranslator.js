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
					alert("can't resolve " + node_name);
					//throw "Can't resolve node";
				}	

				self[node_name] = r.result;

				dfd.resolve(self[node_name]);				

			}).fail(function () {
				self[node_name] = null;
				dfd.resolve(self[node_name]);
				//dfd.reject();
		    });

			return dfd.promise();

		}
	},
	
	getKeyNodes: function(){
	
		var dfd = new jQuery.Deferred();
		var my_array = [];
		var self = this;
		
		my_array.push(this.getKeyNode("big_red_node")); //TODO: add more
		my_array.push(this.getKeyNode("concept_triangle")); //TODO: add more
		$.when.apply($, my_array).done(function (){
		alert("resolved 1: "+ self.big_red_node);
		alert("resolved 2: "+ self.concept_triangle);
			dfd.resolve();
		
		}).fail(function () {
		dfd.reject();
		});
		
		return dfd.promise();
	},

    // temporary solution for keeping KB clean
    wipeOld: function() {
        //find 'big_red_node' that contains all new data and wipe out contents

	alert("resolved 3: " + this.big_red_node);
	console.log(this);
/*		
	var dfd = new jQuery.Deferred();
    
	this.sctp_client.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A,
                                      [
                                          this.bigred,
                                          sc_type_arc_pos_const_perm,
                                          sc_type_node | sc_type_const
                                      ])
    	.done(function (res) {
        	var langs = [];
        
        	for (r in res.result) {
        	    langs.push(res.result[r][2]);
        	}
        
        	dfd.resolve(langs);
        
    	}).fail(function () {
        	dfd.reject();
    	});

	return dfd.promise();
*/	    
    },

    putPoint: function (point) {
	//	if (point.hasOwnProperty("sc_addr") && point.sc_addr != 'null')
	//TODO: add existence check if needed	
	if (point.sc_addr) 
	{
		return point.sc_addr;
	}
        //else
	//{
	//	window.sctpClient.create_node(scg-type-node-const).done(function (r) 
	//	{
        //            point.setScAddr(r.result);
        //        //    point.setObjectState(SCgObjectState.NewInMemory);//not used yet
        //            
        //        });
	//	return point.sc_addr;
        //}
        return "sc_addr";
    },

    putShape: function (shape) {
        return "sc_addr";
    },

    putModel: function (model) {
	//cleanup
	var func = this.wipeOld;
	var self = this;
	this.getKeyNodes().done(function () {	func.call(self);})


	//foreach point create sc-node and add sc_addr
	//foreach shape add shape-defined nodes and arcs
	alert("started");
	for (var i = 0; i < model.points.length; i++) 
	{
		var el = model.points[i];
        	this.putPoint(el);
	}
	
	alert("completed");
        
    }    

};
