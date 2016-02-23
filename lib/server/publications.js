Meteor.publish('ressourcePlanningPublished', function () {
  var self = this;
  var result = Meteor.call('createRessourcePlanning');
  self.added('ressourceplanning', Random.id(), result);
  self.ready();
});

Meteor.publish("production", function () {
  return Production.find();
});

Meteor.publish("transactions", function () {
  return Transactions.find();
});

Meteor.publish("products", function () {
  return Products.find();
});

Meteor.publish("stocks", function () {
  return Stocks.find();
});
