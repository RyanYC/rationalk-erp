if (Meteor.isServer) {

	Meteor.methods({
  	createRessourcePlanning: function () {
			var Products;
			var nProducts;
			var ressourcesNames = [];
			var Ressources = [];
			var l = 0;
			var i;
			var j;
			var planning;
			var planningArrayLength;
			var productId;
			var productName;
			var startDate;
			var productionStep;
			var ressource;
			var duration;

			if (Meteor.settings.public.debug) {
				console.log("Entering the server method createRessourcePlanning...");
			}
      Products = Production.find({}).fetch();
  		nProducts = Products.length;
			if (Meteor.settings.public.debug) {
				console.log("You have : " +  nProducts + " products in your erp.");
			}

  		for (i = 0; i < nProducts; i++) {
  			planning = Products[i].planning;
  			if (typeof planning !== "undefined") {
  				planningArrayLength = planning.length;
  				for (j = 0; j < planningArrayLength; j++) {
  					if (typeof planning[j].ressource !== "undefined") {
  						if (ressourcesNames.indexOf(planning[j].ressource) === -1) {
  							ressourceName = planning[j].ressource;
  							ressourcesNames[l] = ressourceName;
  							l = l + 1;
  							Ressources[ressourceName] = [];
  						}
  					}
  				}
  			}
  		}

  		for (i = 0; i < nProducts; i++) {
  			productId = Products[i]._id;
  			productName = Products[i].productName;
  			planning = Products[i].planning;

  			if (typeof planning !== "undefined") {
  				planningArrayLength = planning.length;
  				for (j = 0; j < planningArrayLength; j++) {
  					if (typeof planning[j].ressource !== "undefined") {
  						startDate = planning[j].startDate;
  						productionStep = planning[j].productionStep;
  						ressource = planning[j].ressource;
  						duration = planning[j].duration;

  						Ressources[ressource].push(
  						{
  							productId: productId,
  							productName: productName,
  							startDate: startDate,
  							productionStep: productionStep,
  							duration: duration,
  						});
  					}
  				}
  			}
  		}

  		if (Meteor.settings.public.debug) {
  			console.log("Ressources : ");
  			console.log(Ressources);
  		}

  		return Ressources;
    },
  });
}
