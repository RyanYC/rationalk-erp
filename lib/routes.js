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

  Router.route("/erp/product/:_id", {
    name: "build",
    data: function () {
      return Production.findOne(this.params._id);
    },
    waitOn: function () {
      return [Meteor.subscribe("production")];
    },
  });
}
