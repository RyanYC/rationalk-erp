Template.stocks.rendered = function () {

};

Template.stocks.helpers({
	Stocks: function () {
		var Products = Production.find({visible:{$ne: false}}).fetch();
		return Products;
	},
	settingsStocks: function () {
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
			        key: 'productQty',
			        label: 'Qty',
			    },
			    {
			        key: 'actions',
			        label: 'Actions',
			        fn: function (value, object) {
				        	//<a href="{{pathFor 'build' _id=this._id}}" title="Open this project"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a> <a class="delete" href="#" title="Delete this project"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
				        	var url;
				        	url = Router.routes.build.path({
					        	_id: object._id
					        });
							return new Spacebars.SafeString('<a href="' + url + '" title="Product Builder"><span class="glyphicon glyphicon-wrench" aria-hidden="true"></span></a> <a class="delete" href="#" data-productId="' + object._id +'" title="Remove from stock"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>');
				       	}
			    }
			]
		}
    }
});

Template.stocks.events({
	'submit form': function (event,template){
	    event.preventDefault();
	    //console.log(template.data);
	    var productName = event.target.productName.value;
		var productQty = Number(event.target.productQty.value);
		Meteor.call('addToStock',productName,productQty, function (error, result) {
		  if (error) {
		    // handle error
		  } else {
		    // examine result
		  }
		});
	},
	"click a.delete": function (event){
	    event.preventDefault();
	    console.log(event.currentTarget.dataset);
	    Meteor.call('deleteProduct', event.currentTarget.dataset.productid, function (error, result) {
		  if (error) {
		    // handle error
		  } else {
		    // examine result
		  }
		});
		return false;
	}
});
