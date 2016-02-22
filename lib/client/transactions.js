Template.transactions.rendered = function () {


};

Template.transactions.helpers({
	planningEntries: function () {
		return Transactions.find({type:"planning"}).fetch();
	},
});

Template.operations.helpers({
	operations: function () {
		RKCore.log("this in operations template, operations helper : ");
		RKCore.log(this);
		product = Products.findOne({name: this.name});
		if (typeof product !== "undefined") {
			RKCore.log(product.operations);
			return product.operations;
		}
		return false;
	},
});
