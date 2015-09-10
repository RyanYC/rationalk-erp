RKERP = {};


Meteor.methods({
		addNeedToThisProduct: function (productId,dataset) {
			check(productId, String);
			check(dataset, Match.Any);
		console.log("Product Id : "+productId);
		console.log("dataset : ");
		console.log(dataset);
		var productName = dataset.productname;
   	    var productionStep = dataset.productionstep;
		var productQty = Number(dataset.productqty);
		console.log('the need : ');
		console.log(productName)
		console.log(productionStep)
		console.log(productQty)
		// Create the needed product if it does not exist yet
		Production.update(
			{
			  $and: [
			  	{productName: productName}
			  ]
			},
			{ $set: { productName: productName} }
			,
			{
			    upsert: true
			}
		);
		// Get the id of the needed product (Balls) :
		var neededProductId = Production.findOne({productName: productName})._id;


		var needs = Production.findOne(productId).needs;


		if (typeof needs !== "undefined" && needs !== null) {
			console.log("Needs before removing :");
			console.log(needs);
			var needsArrayLength = needs.length;
			for (var j = 0; j < needsArrayLength; j++) {
				console.log("current existing need :");
				console.log(needs[j].productName);
				console.log(needs[j].productQty);
				console.log(needs[j].productionStep);
				if (
					(productName == needs[j].productName) &&
					(neededProductId == needs[j].productId) &&
					(productionStep == needs[j].productionStep)
					)
					{
						var arrayElementToRemove = j;
						console.log('We need to remove/update the element : '+ j);
						console.log("Needs after removing :");
						needs.splice(arrayElementToRemove, 1);
						console.log(needs);
						//exit the loop :
						j=needsArrayLength+1;
				} else {
					console.log("This need does not match.");
				}
			}
			Production.update(
				{
				  $and: [
				  	{_id: productId}
				  ]
				},
				{
				    $set: {needs: needs}
				}
			);
		} // end if have needs



		Production.update(
			{
			  $and: [
			  	{_id: productId},
			  ]
			},
			{
			    $push: { needs : {parentProductId:productId,productName:productName,productionStep:productionStep,productQty:productQty,productId:neededProductId} }
			},
			{
			    upsert: true
			}
		);
		var needs = Production.findOne(productId).needs;
		console.log("Needs after updating :");
		console.log(needs);
		if (typeof toastr !== "undefined"){
			toastr.success('The product need has been updated successfully');
		}
	},
	deleteThisNeed: function (dataset) {
		check(dataset, Match.Any);
		//dataset : {parentproductid: "zzLmwhnteDGEmmDxD", productname: "Cage", neededqty: "1", productionstep: "Assembly"}
		var productId = dataset.parentproductid;
		var needs = Production.findOne(productId).needs;
		console.log(needs);
		var needsArrayLength = needs.length;
		for (var j = 0; j < needsArrayLength; j++) {
			var needProductName = dataset.productname;
			var needProductionStep = dataset.productionstep;
			var neededQty = dataset.neededqty;
			if (
				(needProductName == needs[j].productName) &&
				(neededQty == needs[j].productQty) &&
				(needProductionStep == needs[j].productionStep)
				){
				var arrayElementToRemove = j;
			}
		}

		needs.splice(arrayElementToRemove, 1);
		console.log(needs);

		Production.update(
			{
			  $and: [
			  	{_id: productId}
			  ]
			},
			{
			    $set: {needs: needs}
			}
		);
		if (typeof toastr !== "undefined"){
			toastr.success('This product need has deleted');
		}
	},
	planProduction: function (dataset) {
		check(dataset, Match.Any); //#todo
		var productName = dataset.productName;
		var productQty=dataset.productQty;
		var startDate = dataset.startDate;
		var productionStep = dataset.productionStep;
		var ressource = dataset.ressource;
		var duration = dataset.duration;

		Production.update(
			{
			  $and: [
			  	{productName: productName}
			  ]
			},
			{
			    $set: {productName: productName},
			    $push: {
						planning:{
							productQty: Number(productQty),
							startDate:startDate,
							productionStep:productionStep,
							ressource:ressource,
							duration:duration,
						}
					}
			},
			{
			    upsert: true
			}
		);
		if (typeof toastr !== "undefined"){
			toastr.success('The planning for this product has been updated successfully');
		}
	},
	deleteProduction: function (dataset) {
		check(dataset, Match.Any); //#todo
		if (Meteor.settings.public.debug){
			console.log("Deleting production matching : ");
			console.log(dataset);
		}
		var productId = dataset.productid; //que des miniscules dans le dataset
	    var productName = dataset.productname;
		var productionStep = dataset.productionstep;
	    var startDate = dataset.startdate;
	    var plannedQty = dataset.plannedqty;


		var productPlanning = Production.findOne(productId).planning;
		if (Meteor.settings.public.debug){
			console.log(productPlanning);
		}
		var productPlanningArrayLength = productPlanning.length;
		for (var j = 0; j < productPlanningArrayLength; j++) {
			if (Meteor.settings.public.debug){
				console.log("Current planning entry : ");
				console.log(productPlanning[j].productQty);
				console.log(productPlanning[j].productionStep);
				console.log(productPlanning[j].startDate);
			}
			if (
				(plannedQty == productPlanning[j].productQty) &&
				(productionStep == productPlanning[j].productionStep) &&
				(startDate == productPlanning[j].startDate)
				)
				{
					if (Meteor.settings.public.debug){
						console.log("Remove : "+j)
					}
					var arrayElementToRemove = j;
					productPlanning.splice(arrayElementToRemove, 1);
					if (Meteor.settings.public.debug){
						console.log("After removing, the planning looks like : "+j)
						console.log(productPlanning);
					}
			}
		}
		Production.update(
					{
					  $and: [
					  	{_id: productId}
					  ]
					},
					{
					    $set: {planning: productPlanning}
					}
		);
		if (typeof toastr !== "undefined"){
			toastr.success('This event has been deleted');
		}



	},
	addToStock: function (productName,productQty) {
		check(productName, String);
		check(productQty, Number);
		if (Meteor.settings.public.debug) {
			console.log(productQty);
		}
		Production.update(
			{
			  $and: [
			  	{productName: productName}
			  ]
			},
			{
			    $inc: { productQty: Number(productQty) },
			    $set: { productName : productName }
			},
			{
			    upsert: true
			}
		);
		if (typeof toastr !== "undefined"){
			toastr.success('The stock has been updated successfully');
		}
	},
	deleteProduct: function (productId) {
		check(productId, String);
		var productName = Production.findOne(productId).productName;

		//check if the product is not used in another product :
		var allProducts = Production.find({}).fetch();
		var arrayLength = allProducts.length;
		var neededIn= "";
		var neededSomewhere=false;
		for (var i = 0; i < arrayLength; i++) {
			var needs = allProducts[i].needs;
			var parentProductName = allProducts[i].productName
			if (typeof needs !== "undefined") {
				var needsArrayLength = needs.length;
				for (var j = 0; j < needsArrayLength; j++) {
					if (productName== needs[j].productName){
						neededIn=neededIn + ((neededIn =="") ? "" : ", ") + parentProductName;
						neededSomewhere=true;
					}
				}
			}
		}

		//check if the product is not planned
		var planning = Production.findOne(productId).planning;
		var plannedSomewhen=false;
		if (typeof planning !== "undefined"){
			if (planning.length>0){
				plannedSomewhen=true;
			}
		}


		if (neededSomewhere==true){
			if (typeof toastr !== "undefined"){
				toastr.error(productName +' cannot be deleted since it used in : '+neededIn);
			}
		}
		else if (plannedSomewhen==true){
			if (typeof toastr !== "undefined"){
				toastr.error(productName +' cannot be deleted since it is a production is planned');
			}
		}
		else {
			if (Meteor.settings.public.debug){
				console.log("remove : "+productId);
			}
			Production.remove({_id:productId});
			if (typeof toastr !== "undefined"){
				toastr.success(productName + ' has been deleted');
			}
		}
	}
});
