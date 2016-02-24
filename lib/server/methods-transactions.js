if (Meteor.isServer) {
	var data = [];
	var calculateCumulativeQty = function(data){
		//data should be sorted in date ascending order
		//Sort by date :
		data.sort(function(a,b){
			aa = moment(a.date, "DD.MM.YYYY");
			bb = moment(b.date, "DD.MM.YYYY");
			return aa.diff(bb);
		});

		var nLines = data.length;
		var cumulativeQty = {};
		for (var i = 0; i < nLines; i++) {
			productName = data[i].name;
			if (!cumulativeQty.hasOwnProperty(productName)){
				cumulativeQty[productName] = 0;
			}
			cumulativeQty[productName] = cumulativeQty[productName] + Number(data[i].qty);
			data[i].cumulativeQty = cumulativeQty[productName];
		}
		return data;
	}

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
		qty = element.qty;
		obj.qty = element.qty;

		operationPath = element.operationPath;
		obj.operationPath = element.operationPath;


		obj.operation = element.operation;
		obj.note = "Needed to produce the parent product: " + this.name;
		data.push(obj);
		getNeeds(element.name, data, qty, date, operationPath);
	}

	var getNeeds = function (name, data, parentQty, parentDate, operationPath) {
		RKCore.log("parentQty : " + parentQty);
		RKCore.log("parentDate : " + parentDate);
		product = Products.findOne({name: name});
		if (typeof product !== "undefined") {
			RKCore.log("The product exists in the database and looks like this :");
			RKCore.log(product);
			needs = product.needs;
			if (typeof needs !== "undefined") {
				nNeeds = needs.length;
				RKCore.log("The product "+ name + " has " + nNeeds + " needs :");
				RKCore.log(needs);
				RKCore.log("Let's loop though the needs of this product...");
				parentProduct = product;

				var multipliedNeeds = needs.map(function(obj){
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
					 RKCore.log("date to start to take into account the step duration:");
					 RKCore.log(date);
					 rObj.date = date
				   return rObj;
				});


				multipliedNeedsWithDateAndPath.forEach(storeNeedInData, parentProduct);

			}
			else {
				RKCore.log("The product : " + name + " in your product database has no needs")
			}
		}
		else {
			RKCore.log("The product " + name + " does not exist in the Products database");
			/*
			var obj = {};
			obj.date = "-";
			obj.name = name;
			obj.qty = "-";
			obj.note = "The product " + name + " does not exist in the Products database";
			data.push(obj);
			*/
		}
		return data;
	}

	var getTransactionsData = function () {
		stocks = Stocks.find({}).fetch();
		var nStocks = stocks.length;
		for (var j = 0; j < nStocks; j++) {
			var obj = {};
			obj.date = moment().format("DD.MM.YYYY"); //today
			obj.name = stocks[j].name;
			obj.qty = stocks[j].qty;
			obj.note = "Stock value today";
			data.push(obj);
		}

		transactions = Transactions.find({type:"planning"}).fetch();
		var nTransactions = transactions.length;
		for (var i = 0; i < nTransactions; i++) {
			var obj = {}
			obj.date = transactions[i].date;
			parentDate = transactions[i].date;
			obj.name = transactions[i].name;
			parentQty = transactions[i].qty;
			obj.qty = transactions[i].qty; // qty is positive as you create product
			obj.note = "Planned production";
			operationPath = transactions[i].productionId;
			obj.operationPath = transactions[i].productionId
			data.push(obj);
			data = getNeeds(obj.name, data, parentQty, parentDate, operationPath);
		}


		//evaluate live stock (cumulated quantities)
		data = calculateCumulativeQty(data);
		return data;
	};


	Meteor.methods({
		getTransactionsDataMethod: function () {
			return getTransactionsData();
		},
  });
}
