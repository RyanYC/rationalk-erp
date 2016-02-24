Template.products.helpers({
	products: function () {
		return Products.find({}).fetch();
	},
});

Template.product.helpers({
	needs: function () {
		RKCore.log("this in product template, needs helper : ");
		RKCore.log(this);
		product = Products.findOne({name: this.name});
		RKCore.log("product in product template, needs helper : ");
		RKCore.log(product);
		if (typeof product === "undefined") {
			return [];
		}
		if (typeof product.needs !== "undefined") {
			return product.needs;
		}
		return [];
	},
});
