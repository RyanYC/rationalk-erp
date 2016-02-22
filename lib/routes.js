if (Meteor.settings.public.show.erp) {
  Router.route("/erp/stocks", {
    name: "stocks",
    waitOn: function () {
      return [Meteor.subscribe("production")];
    },
  });

  Router.route("/erp/plan", {
    name: "plan",
    waitOn: function () {
      return [
        Meteor.subscribe("production"),
        //Meteor.subscribe("ressourcePlanningPublished"),
      ];
    },
  });

  Router.route("/erp/transactions", {
    name: "transactions",
    waitOn: function () {
      return [
        Meteor.subscribe("transactions"),
        Meteor.subscribe("products"),
        //Meteor.subscribe("ressourcePlanningPublished"),
      ];
    },
  });

  Router.route("/erp/product/:_id", {
    name: "build",
    data: function () {
      return Production.findOne(this.params._id);
    },
    waitOn: function () {
      return [Meteor.subscribe("production")];
    },
  });


  urlPlan = Router.routes.plan.path();
  urlStocks = Router.routes.stocks.path();
  urlTransactions = Router.routes.transactions.path();
  menuHTML = new Spacebars.SafeString(
     '<li role="separator" class="divider"></li>'
      + '<li class="dropdown-header">ERP</li>'
      + '<li><a href="' + urlPlan + '" title="Plan">Plan</a></li>'
      + '<li><a href="' + urlStocks + '" title="Stocks">Stocks</a></li>'
      + '<li><a href="' + urlTransactions + '" title="Stocks">Stocks</a></li>'
      + '<li role="separator" class="divider"></li>'
  );

  RKCore.packageMenu.push(
    {
      "menuHTML": menuHTML,
      "fromPackage": "rationalk:fmea",
    }
  );

}
