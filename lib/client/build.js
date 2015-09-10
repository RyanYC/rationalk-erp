Template.build.rendered = function () {
	 var productId = this.data._id;
	 var productName = this.data.productName;
	 var productQty = this.data.productQty;
};

Template.build.helpers({
	Needs: function () {
		//console.log(this);
		return this.needs;
	},
	settingsNeeds: function () {
        return {
            rowsPerPage: 1000,
            showFilter: false,
            showNavigation: 'never',
            class: 'table table-condensed col-sm-12',
			fields: [
			    //{
			    //    key: 'productId',
			    //    label: 'Product Id'
			    //},
			    {
			        key: 'productName',
			        label: 'Product Name'
			    },
			    {
			        key: 'productQty',
			        label: 'Needed Qty',
			    },
			    {
			        key: 'productionStep',
			        label: 'Production Step',
			    },
			    {
			        key: 'actions',
			        label: 'Actions',
			        fn: function (value, object) {
				        	//<a href="{{pathFor 'project' _id=this._id}}" title="Open this project"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a> <a class="delete" href="#" data-parentProductId="{{../_id}}" data-productName="{{productName}}" data-neededQty="{{productQty}}" data-productionStep="{{productionStep}}" title="Delete this need"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
				        	var url;
				        	url = Router.routes.build.path({
					        	_id: object.productId
					        });
							return new Spacebars.SafeString('<a href="' + url + '" title="Product Builder"><span class="glyphicon glyphicon-wrench" aria-hidden="true"></span></a> <a class="delete" href="#" data-parentProductId="' + object.parentProductId +'" data-productId="' + object.productId +'" data-productName="' + object.productName +'" data-productionStep="' + object.productionStep +'" data-neededQty="' + object.productQty +'" title="Delete this need"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>');
				       	}
			    }
			]
		}
    }
});

Template.build.events({
	'submit form': function (event,template){
	    event.preventDefault();
	    //console.log(template.data);

		var productId = template.data._id;
		var dataset ={}
		dataset.productname=event.target.productName.value;
		dataset.productionstep=event.target.productionStep.value;
		dataset.productqty=event.target.productQty.value;
		console.log(dataset);
		Meteor.call('addNeedToThisProduct',productId,dataset, function (error, result) {
		  if (error) {
		    // handle error
		  } else {
		    // examine result
		  }
		});
	},
	"click a.delete": function (event){
	    event.preventDefault();
	    //console.log(this);
	    console.log(event.currentTarget.dataset);
	    // {parentproductid: "zzLmwhnteDGEmmDxD", productname: "Cage", neededqty: "1", productionstep: "Assembly"}

	    Meteor.call('deleteThisNeed',event.currentTarget.dataset, function (error, result) {
		  if (error) {
		    // handle error
		  } else {
		    // examine result
		  }
		});
		return false;
	},

});
