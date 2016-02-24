Stocks.remove({});

Stocks.insert({
    "name": "Product A",
    "qty" : 1,
});

Stocks.insert({
    "name": "Product BB",
    "qty" : 3,
});

Transactions.remove({});

Transactions.insert({
    "name": "Product A",
    "date": "25.02.2016",
    "type" : "planning",
    "qty" : 10,
    "productionId" : "OF1521A"
});

Transactions.insert({
    "name": "Product B",
    "date": "27.02.2016",
    "type" : "planning",
    "qty" : 20,
    "productionId" : "OF1123B"
});

Products.remove({});
Products.insert({
  "name" : "Product A",
  "needs" : [
        {
          "name" : "Product B",
          "qty" : 2,
          "operation" : "Step 1 for prod A",
          "duration" : 2,
        },
        {
          "name" : "Product C",
          "qty" : 201,
          "operation" : "Step 1 for prod A",
          "duration" : 1,
        },
        {
          "name" : "Product E",
          "qty" : 25,
          "operation" : "Step 2 for prod A",
          "duration" : 5,
        },
      ],
});
Products.insert({
  "name" : "Product B",
  "needs" : [
        {
          "name" : "Product BB",
          "qty" : 11,
          "operation" : "Step 1 for prod B",
          "duration" : 1,
        },
        {
          "name" : "Product BC",
          "qty" : 12,
          "operation" : "Step 1 for prod B",
          "duration" : 5,
        },
        {
          "name" : "Product BD",
          "qty" : 13,
          "operation" : "Step 2 for prod B",
          "duration" : 15,
        },
  ]
});
