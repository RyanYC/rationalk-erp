Transactions.remove({});

Transactions.insert({
    "name": "Product A",
    "date": "25.2.16",
    "type" : "planning",
    "qty" : 10,
});

/*
Transactions.insert({
    "name": "Product B",
    "date": "27.2.16",
    "type" : "planning",
    "qty" : 20,
});
*/

Products.remove({});
Products.insert({
  "name" : "Product A",
  "operations" : [
    {
      "name" : "Step 1 for prod A",
      "needs" : [
        {
          "name" : "Product B",
          "qty" : 202,
        },
        {
          "name" : "Product C",
          "qty" : 201,
        },
      ]
    },
    {
      "name" : "Step 2 for prod A",
      "needs" : [
        {
          "name" : "Product E",
          "qty" : 25,
        },
      ]
    },
    /*
    {
      "name" : "Step 3",
      "needs" : [
        {
          "name" : "Product F",
          "qty" : 3,
        },
        {
          "name" : "Product G",
          "qty" : 100,
        },
      ]
    },
    */
  ]
});
Products.insert({
  "name" : "Product B",
  "operations" : [
    {
      "name" : "Step 1 for product B",
      "needs" : [
        {
          "name" : "Product BB",
          "qty" : 11,
        },
        {
          "name" : "Product BC",
          "qty" : 12,
        },
      ]
    },
    {
      "name" : "Step 2 for product B",
      "needs" : [
        {
          "name" : "Product BD",
          "qty" : 13,
        },
      ]
    },
  ]
});
