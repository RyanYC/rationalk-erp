Production = new Mongo.Collection('production');

Production.allow( {
		insert: function (userId) {return !! userId; },
		update: function (userId) {return !!userId; },
    remove: function (userId) {return !!userId; },
});

//expose it to the other packages :
RKERP.Production = Production;
