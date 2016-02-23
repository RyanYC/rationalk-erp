var getProductOperations = function (name, data) {
	//var note1 = "Needed to build : " + name;
	RKCore.log("Needed to build : " + name);
	product = Products.findOne({name: name});
	if (typeof product !== "undefined") {
		RKCore.log("product.operations in getProductOperations : ");
		RKCore.log(product.operations);
		operations = product.operations;
		nOperations = operations.length;
		RKCore.log("The product "+ name + " has " + nOperations + " operations.");
		//note2 =  " / The product "+ name + " has " + nOperations + " operations.";
		var j = 0;
		while (j < nOperations) {
			var needs = [];
			RKCore.log("j (operation's number) : " + j);
			//note =  note2 + " / Operation : " + operations[j].name;
			//note =  note + " / j (operation's number) : " + j;
			needs = operations[j].needs;
			RKCore.log("needs : ");
			RKCore.log(needs);
			nNeeds = needs.length;
			//RKCore.log(nNeeds + " needs in the operation : " + operations[j].name + ".");
			var k = 0;
			while (k < nNeeds) {
				RKCore.log("k (need's number) : " + k);
				var obj = {};
				obj.date = "dummydate";
				name = needs[k].name;
				obj.name = name;
				obj.qty = needs[k].qty;
				obj.note = "j = " + j + ' / k = ' + k;
				data.push(obj);
				//note = "";
				data = getProductOperations(name, data);
				k++;
			}
			j++;
		}
	}
	else {
		RKCore.log("The product " + name + " does not exist in the Products database");
		var obj = {};
		obj.date = "dummydate";
		obj.name = name;
		obj.qty = "?";
		obj.note = "The product " + name + " does not exist in the Products database";
		data.push(obj);
	}
	return data;
}

var getTransactionsData = function () {
	var data = [];
	var operations = [];
	transactions = Transactions.find({type:"planning"}).fetch();
	var nTransactions = transactions.length;
	for (var i = 0; i < nTransactions; i++) {
		var obj = {}
	  obj.date = transactions[i].date;
		obj.name = transactions[i].name;
		obj.qty = transactions[i].qty;
		obj.note = "From planning";
		data.push(obj);
		data = getProductOperations(obj.name, data);
	}
	return data;
};

Template.transactionsTable.helpers({
	transactionsData: function () {
		data = getTransactionsData();
		return data;
	},
});

Template.transactions.helpers({
	planningEntries: function () {
		return Transactions.find({type:"planning"}).fetch();
	},
});

Template.operations.helpers({
	operations: function () {
		//RKCore.log("this in operations template, operations helper : ");
		//RKCore.log(this);
		product = Products.findOne({name: this.name});
		if (typeof product !== "undefined") {
			//RKCore.log(product.operations);
			return product.operations;
		}
		return false;
	},
});
