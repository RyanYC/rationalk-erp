var createRessourcePlanning = function () {
		var Products = Production.find({}).fetch();
		var nProducts = Products.length;
		var ressourcesNames = [];
		var Ressources = new Array();
		var l = 0;
		for (var i = 0; i < nProducts; i++) {
			var planning = Products[i].planning;
			if (typeof planning !== "undefined") {
				var planningArrayLength = planning.length;
				for (var j = 0; j < planningArrayLength; j++) {
					if (typeof planning[j].ressource !== "undefined") {
						if (ressourcesNames.indexOf(planning[j].ressource)==-1){
							ressourceName = planning[j].ressource;
							ressourcesNames[l] = ressourceName;
							l = l + 1;
							Ressources[ressourceName] = new Array();
						}
					}
				}
			}
		}

		for (var i = 0; i < nProducts; i++) {
			var productId = Products[i]._id;
			var productName = Products[i].productName;
			var planning = Products[i].planning;

			if (typeof planning !== "undefined") {
				var planningArrayLength = planning.length;
				for (var j = 0; j < planningArrayLength; j++) {
					if (typeof planning[j].ressource !== "undefined") {

						var startDate = planning[j].startDate;
						var productionStep = planning[j].productionStep;
						var ressource = planning[j].ressource;
						var duration = planning[j].duration;

						Ressources[ressource].push(
						{
							productId:productId,
							productName:productName,
							startDate:startDate,
							productionStep:productionStep,
							duration:duration
						});
					}
				}
			}
		}

		if (Meteor.settings.public.debug){
			console.log("Ressources : ");
			console.log(Ressources);
		}

		return Ressources;
};


var createProductionPlanning = function () {
		var Products = Production.find({}).fetch();
		if (Meteor.settings.public.debug){
			console.log(Products);
		}
		var Events= new Array();
		var stockMovements= new Array();
		var arrayLength = Products.length;
		//A first loop to store all actual product quantities :
		var Quantities= new Array();
		for (var i = 0; i < arrayLength; i++) {
			var productName = Products[i].productName;
			var productQty = Products[i].productQty;
			if (typeof productQty === "undefined") {
				productQty=0;
			}
			Quantities[productName]=productQty;
		}
		if (Meteor.settings.public.debug){
			console.log(Quantities);
		}

		for (var i = 0; i < arrayLength; i++) {
			var productId = Products[i]._id;
			var productName = Products[i].productName;
			var planning = Products[i].planning;
			if (typeof planning !== "undefined") {
				var planningArrayLength = planning.length;
				for (var j = 0; j < planningArrayLength; j++) {
					var plannedQty = planning[j].productQty;
					var startDate = planning[j].startDate;
					var productionStep = planning[j].productionStep;
					var ressource = planning[j].ressource;
					var duration = planning[j].duration;

					if (Meteor.settings.public.debug){
						console.log(productName);
						console.log(plannedQty);
						console.log(startDate);
					}
					var beforeEventQty = Quantities[productName];
					var afterEventQty = beforeEventQty + plannedQty;
					Quantities[productName] =  afterEventQty ;
					Events.push(
					{
						productId:productId,
						productName:productName,
						plannedQty:plannedQty,
						startDate:startDate,
						productionStep:productionStep,
						duration:duration,
						ressource:ressource,
						type:"Production",
						afterEventQty:afterEventQty
					});
				}
				var productionEvents = Events;

				productionEvents = productionEvents.sort(function (a,b){
					// Turn your strings into dates, and then subtract them
					// to get a value that is either negative, positive, or zero.
					return new Date(a.startDate) - new Date(b.startDate);
				});


			}
		}

		return productionEvents;
};


Template.plan.rendered = function () {

	/*
	Meteor.call('createRessourcePlanning', function (error, result) {
		if (error) {
			// handle error
			console.log(error)
		} else {
			// examine result
			Session.set('resourcePlanning',result);
		}
	});

	resourcePlanning = Session.get('resourcePlanning');
	*/
	//return resourcePlanning.find();
	// http://docs.dhtmlx.com/gantt/samples/02_extensions/08_tasks_grouping.html

	ressourcePlanning = createRessourcePlanning();
	var tasks = [];
	var data = new Array();
	for(var i in ressourcePlanning) {
		if (Meteor.settings.public.debug){
			console.log("key " + i + " has value " + ressourcePlanning[i]);
		}
		var ProductionPlannedForThisRessource = ressourcePlanning[i];
		ProductionPlannedForThisRessourceLength = ProductionPlannedForThisRessource.length;
		for (var j = 0; j < ProductionPlannedForThisRessourceLength; j++) {
			var duration = ProductionPlannedForThisRessource[j].duration;
			var startDate = ProductionPlannedForThisRessource[j].startDate;
			var productName = ProductionPlannedForThisRessource[j].productName;
			//var m = moment(startDate,"YYYY-MM-DD").format("DD-MM-YYYY");
			//console.log(m);
			var obj = [];
			obj.id = l;
			obj.text = productName;
			obj.start_date = moment(startDate,"YYYY-MM-DD").format("DD-MM-YYYY");
			obj.duration = duration;
			data.push(obj);
			l = l + 1;
		}
	}
	tasks.data = data;

	/*
	var tasks =  {
        data:[
            {id:1, text:"Project #2", start_date:"01-04-2013", duration:18,order:10,progress:0.4, open: true},
            {id:2, text:"Task #1", 	  start_date:"02-04-2013", duration:8, order:10,progress:0.6, parent:1},
            {id:3, text:"Task #2",    start_date:"11-04-2013", duration:8, order:20,progress:0.6, parent:1}
        ],
        links:[
            { id:1, source:1, target:2, type:"1"},
            { id:2, source:2, target:3, type:"0"},
            { id:3, source:3, target:4, type:"0"},
            { id:4, source:2, target:5, type:"2"},
        ]
    };
	*/

	gantt.init("gantt_here");

	gantt.parse(tasks);


};

Template.plan.helpers({
	productionPlanning: function () {
		var productionPlanning = createProductionPlanning();
		return productionPlanning;
	},
	settingsProductionPlanning: function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            class: 'table table-condensed col-sm-12',
            rowClass: function (item) {
				if (item.afterEventQty<=0){
					return 'danger';
				}
				else {
					return '';
				}
			},
			fields: [
			    {
			        key: 'productName',
			        label: 'Product Name'
			    },
			    {
			        key: 'productionStep',
			        label: 'Production Step',
			    },
					{
			        key: 'ressource',
			        label: 'Ressource',
			    },
			    {
			        key: 'plannedQty',
			        label: 'Planned Qty',
			    },
			    {
			        key: 'startDate',
			        label: 'Start Date',
			    },
					{
			        key: 'duration',
			        label: 'Duration',
			    },
			    {
			        key: 'actions',
			        label: 'Actions',
			        fn: function (value, object) {
				        	//<a href="{{pathFor 'build' _id=productId}}" title="Product Builder"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>  this.productName,this.startDate,this.plannedQty
				        	var url;
				        	url = Router.routes.build.path({
					        	_id: object.productId
					        });
									return new Spacebars.SafeString('<a href="' + url + '" title="Product Builder"><span class="glyphicon glyphicon-wrench" aria-hidden="true"></span></a> <a class="delete" href="#" data-productId="' + object.productId +'" data-productName="' + object.productName +'" data-productionStep="' + object.productionStep +'" data-startDate="' + object.startDate +'" data-plannedQty="' + object.plannedQty +'" title="Delete this production"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>');
				      }
			    }
			]
		}
  },
	ressourcePlanning: function (){
		var ressourcePlanning = createRessourcePlanning();
		if (Meteor.settings.public.debug){
			console.log(ressourcePlanning);
		}


		var str = '<ul>';
		for(var i in ressourcePlanning) {
			if (Meteor.settings.public.debug){
				console.log("key " + i + " has value " + ressourcePlanning[i]);
			}
			str = str.concat('<li>');
			str = str.concat('<p>');
			str = str.concat(i);
			str = str.concat('</p>');
			var ProductionPlannedForThisRessource = ressourcePlanning[i];
			ProductionPlannedForThisRessourceLength = ProductionPlannedForThisRessource.length;
			str = str.concat('<ul>');
			for (var j = 0; j < ProductionPlannedForThisRessourceLength; j++) {
				var duration = ProductionPlannedForThisRessource[j].duration;
				var startDate = ProductionPlannedForThisRessource[j].startDate;
				var productName = ProductionPlannedForThisRessource[j].productName;
				str = str.concat('<li>');
				str = str.concat(productName + "/" + startDate + "/" + duration);
				str = str.concat('</li>');
			}
			str = str.concat('</ul>');
			str = str.concat('</li>');
		}
		str = str.concat('</ul>');
		return new Spacebars.SafeString(str);
	},
	settingsStockMovements: function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            class: 'table table-condensed col-sm-12',
            rowClass: function (item) {
				if (item.afterEventQty<=0){
					return 'danger';
				}
				else {
					return '';
				}
			},
			fields: [
			    {
			        key: 'neededProductName',
			        label: 'Product Name'
			    },
			    {
			        key: 'startDate',
			        label: 'Date',
			    },
			    {
			        key: 'beforeEventQty',
			        label: 'Qty before',
			    },
			    {
			        key: 'totalNeededProductQty',
			        label: 'Qty needed',
			    },
			    {
			        key: 'afterEventQty',
			        label: 'Qty after',
			    },
			    {
			        key: 'comment',
			        label: 'Help',
			    }
			]
		}
    },
	stockMovements: function () {

		var productionEvents = createProductionPlanning();
		var stockMovements= new Array();

		var Products = Production.find({}).fetch();
		var arrayLength = Products.length;
		//A first loop to store all actual product quantities :
		var Quantities= new Array();
		for (var i = 0; i < arrayLength; i++) {
			var productName = Products[i].productName;
			var productQty = Products[i].productQty;
			if (typeof productQty === "undefined") {
				productQty=0;
			}
			Quantities[productName]=productQty;
		}
		if (Meteor.settings.public.debug){
			console.log(Quantities);
		}
		var productionEventsArrayLength = productionEvents.length;
		for (var i = 0; i < productionEventsArrayLength; i++) {
			var parentProductName = productionEvents[i].productName;
			var parentStartDate = productionEvents[i].startDate;
			var parentPlannedQty = productionEvents[i].plannedQty;
			var parentProductionStep = productionEvents[i].productionStep;

			// Pour chaque evenement de prod on va regarder les stocks que cela utilisent
			var neededProducts = Production.find({productName:productionEvents[i].productName}).fetch();
			var neededProductsArrayLength = neededProducts.length;
			for (var k = 0; k < neededProductsArrayLength; k++) {
				var needs = neededProducts[k].needs;
				if (Meteor.settings.public.debug){
					console.log(needs);
				}
				if (typeof needs !== "undefined") {
					var needsArrayLength = needs.length;
					for (var l = 0; l < needsArrayLength; l++) {
						var neededDuringThisProductionStep = needs[l].productionStep;

						if (parentProductionStep===neededDuringThisProductionStep){
							var neededProductName = needs[l].productName;
							if (Meteor.settings.public.debug){
								console.log(neededProductName);
							}
							var neededProductQty = needs[l].productQty;
							if (Meteor.settings.public.debug){
								console.log(neededProductQty);
							}
							var beforeEventQty = Quantities[neededProductName];
							var afterEventQty = beforeEventQty - parentPlannedQty * neededProductQty;
							Quantities[neededProductName] =  afterEventQty ;

							if (afterEventQty<0){
								label="danger";
							}
							else {
								label="default";
							}

							stockMovements.push(
								{
									neededProductQty:neededProductQty,
									totalNeededProductQty:parentPlannedQty*neededProductQty,
									neededProductName:neededProductName,
									startDate:parentStartDate,
									productionStep:parentProductionStep,
									type:"Stock movement",
									comment:"Stock of "+neededProductName +" decreases for the production of "+ parentPlannedQty+" product(s) : "+parentProductName+ " at the step : "+parentProductionStep+" starting on :"+parentStartDate,
									beforeEventQty:beforeEventQty,
									afterEventQty:afterEventQty
								}
							);
						}
						else {
							if (Meteor.settings.public.debug){
								console.log("No needs in this production step ");
							}
						}

					} //end loop over needs
				} // end if needs undefined
			} // end loop over needed products
		} //end loop over productionEvent array


		stockMovements = stockMovements.sort(function (a,b){
			return new Date(a.startDate) - new Date(b.startDate);
		});

		return stockMovements;
	}
});

Template.plan.events({
	'submit form': function (event){
	    event.preventDefault();
	    var dataset={};
	    dataset.productName = event.target.productName.value;
			dataset.productQty = Number(event.target.productQty.value);
			dataset.startDate = event.target.startDate.value;
			dataset.productionStep = event.target.productionStep.value;
			dataset.ressource = event.target.ressource.value;
			dataset.duration = event.target.duration.value;

		Meteor.call('planProduction',dataset, function (error, result) {
		  if (error) {
		    // handle error
		  } else {
		    // examine result
		  }
		});
	},
	"click a.delete": function (event,template){
	    event.preventDefault();
			if (Meteor.settings.public.debug){
	    	console.log(this);
	    	console.log(event.currentTarget.dataset);
			}
	    Meteor.call('deleteProduction',event.currentTarget.dataset,
	    	function (error, result) {
			  if (error) {
			    // handle error
			  } else {
			    // examine result
			  }
			}
			);
			return false;
	}
});
