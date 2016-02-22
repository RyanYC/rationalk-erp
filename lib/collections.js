Production = new Mongo.Collection('production');
Products = new Mongo.Collection('products');
Transactions = new Mongo.Collection('transactions');

Production.allow( {
		insert: function (userId) {return !! userId; },
		update: function (userId) {return !!userId; },
    remove: function (userId) {return !!userId; },
});

Products.allow( {
		insert: function (userId) {return !! userId; },
		update: function (userId) {return !!userId; },
    remove: function (userId) {return !!userId; },
});

Transactions.allow( {
		insert: function (userId) {return !! userId; },
		update: function (userId) {return !!userId; },
    remove: function (userId) {return !!userId; },
});

//expose it to the other packages :
RKERP.Production = Production;
