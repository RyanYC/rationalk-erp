var data = []; // global
var id = 1;


var storeNeedInData = function(element, index, array){
	RKCore.log("parentProduct : ");
	RKCore.log(this);
	RKCore.log("element.name :");
	RKCore.log(element.name);
	RKCore.log("data : ");
	RKCore.log(data);
	var obj = {};

	date = element.date;
	obj.date = element.date;
	obj.name = element.name;
	obj.duration = element.duration;
	qty = element.qty;
	obj.qty = element.qty;

	operationPath = element.operationPath;
	obj.operationPath = element.operationPath;

	id = id + 1;
	RKCore.log("id for the ganntt : ");
	RKCore.log(id);
	obj.id = id;

	parentGanntId = id;
	obj.parent = element.parent;

	obj.operation = element.operation;
	obj.note = "Needed to produce the parent product: " + this.name;
	data.push(obj);
	getNeeds(element.name, data, qty, date, operationPath, parentGanntId);
}

var getNeeds = function (name, data, parentQty, parentDate, operationPath, parentGanntId) {
	RKCore.log("parentQty : " + parentQty);
	RKCore.log("parentDate : " + parentDate);
	RKCore.log("parentGanntId : " + parentGanntId);
	product = Products.findOne({name: name});
	if (typeof product !== "undefined") {
		RKCore.log("The product exists in the database and looks like this :");
		RKCore.log(product);
		needs = product.needs;
		parentProduct = product; // store in parentProduct for later use
		if (typeof needs !== "undefined") {
			nNeeds = needs.length;
			RKCore.log("The product "+ name + " has " + nNeeds + " needs :");
			//RKCore.log(needs);
			RKCore.log("Let's loop though the needs of this product...");

			var needsWithParents = needs.map(function(obj){
				 var rObj = {};
				 rObj = obj;
				 rObj.parent = parentGanntId;
				 return rObj;
			});

			//RKCore.log("needsWithParents :");
			//RKCore.log(needsWithParents);

			var multipliedNeeds = needsWithParents.map(function(obj){
				 var rObj = {};
				 rObj = obj;
				 rObj.qty = -1 * Math.abs(Number(obj.qty) * Number(parentQty)); //negative as this is a need
				 return rObj;
			});

			// calculate date
			var multipliedNeedsWithDate = multipliedNeeds.map(function(obj){
				 var rObj = {};
				 rObj = obj;
				 rObj.operationPath = operationPath;
				 return rObj;
			});

			// calculate date
			var multipliedNeedsWithDateAndPath = multipliedNeedsWithDate.map(function(obj){
				 var rObj = {};
				 rObj = obj;
				 date = moment(parentDate, "DD.MM.YYYY"); // not a string
				 date = date.subtract(obj.duration, "days");// not a string
				 date = date.format("DD.MM.YYYY"); // a string
				 //RKCore.log("date to start to take into account the step duration:");
				 //RKCore.log(date);
				 rObj.date = date
				 return rObj;
			});

			RKCore.log("multipliedNeedsWithDateAndPath : ");
			RKCore.log(multipliedNeedsWithDateAndPath);

			multipliedNeedsWithDateAndPath.forEach(storeNeedInData, parentProduct);

		}
		else {
			RKCore.log("The product : " + name + " in your product database has no needs")
		}
	}
	else {
		RKCore.log("The product " + name + " does not exist in the Products database");
	}
	return data;
}

var getTransactionsData = function (productionId) {

	transaction = Transactions.findOne({
		$and: [
		{type:"planning"},
		{productionId: productionId}
		]
	});

	var obj = {}
	parentId = transaction._id;
	obj.date = transaction.date;
	parentDate = transaction.date;
	obj.name = transaction.name;
	parentQty = transaction.qty;
	obj.qty = transaction.qty; // qty is positive as you create product
	operationPath = transaction.productionId;
	obj.operationPath = transaction.productionId;
	obj.open = true;
	// obj.parent empty
	obj.id = 1; //Gannt id
	parentGanntId = obj.id;
	data.push(obj);
	data = getNeeds(obj.name, data, parentQty, parentDate, operationPath, parentGanntId);

	return data;
};



Template.RKERPgantt.rendered = function () {
	RKCore.log("this.data.productionId :");
	RKCore.log(this.data.productionId);
	productionId = this.data.productionId;
	data = getTransactionsData(productionId);
	RKCore.log("data :");
	RKCore.log(data);

	var tasks = {};
	var tasksData = [];
	nData = data.length;
	RKCore.log("nData : " + nData);
	for (var i = 0; i < nData; i++) {
			var obj = {
				id: data[i].id,
				text: data[i].name,
				parent: data[i].parent,
				start_date: moment(data[i].date,"DD.MM.YYYY").format("DD-MM-YYYY"),
				//start_date: "01-04-2013",
				duration: data[i].duration,
			};
			tasksData.push(obj);
	}
	tasks.data = tasksData;

	var links = [];
	for (var i = 0; i < nData; i++) {
		// id -> parent
		if (typeof tasksData[i].parent !== "undefined") {
			var obj = {
				id: i + 1,
				source: tasksData[i].id,
				target: tasksData[i].parent,
				type: "0",
			}
			links.push(obj);
		}
	}

	/*
	var links = [
			{ id: 1, source: 1, target: 2, type: "0"},
	];
	*/
	tasks.links = links;
	RKCore.log("tasks : ");
	RKCore.log(tasks);
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

	gantt.init("ganttDivId");
	gantt.parse(tasks);
};

Template.RKERPgantt.helpers({

});
