Transactions.remove({});

Transactions.insert({
    "name": "Product A",
    "date": "25.2.16",
    "type" : "planning",
    "qty" : 10,
});

Transactions.insert({
    "name": "Product B",
    "date": "27.2.16",
    "type" : "planning",
    "qty" : 20,
});

Products.remove({});
Products.insert({
  "name" : "Product A",
  "operations" : [
    {
      "name" : "Step 1 for prod A",
      "needs" : [
        {
          "name" : "Product B",
          "qty" : 20,
        },
        {
          "name" : "Product C",
          "qty" : 20,
        },
      ]
    },
    {
      "name" : "Step 2",
      "needs" : [
        {
          "name" : "Product D",
          "qty" : 22,
        },
        {
          "name" : "Product E",
          "qty" : 25,
        },
      ]
    },
    {
      "name" : "Step 3",
      "needs" : [
        {
          "name" : "Product F",
          "qty" : 10,
        },
        {
          "name" : "Product G",
          "qty" : 100,
        },
      ]
    },
  ]
});
Products.insert({
  "name" : "Product B",
  "operations" : [
    {
      "name" : "Step 1",
      "needs" : [
        {
          "name" : "Product BB",
          "qty" : 20,
        },
        {
          "name" : "Product BC",
          "qty" : 20,
        },
      ]
    },
    {
      "name" : "Step 2",
      "needs" : [
        {
          "name" : "Product BD",
          "qty" : 20,
        },
        {
          "name" : "Product BE",
          "qty" : 20,
        },
      ]
    },
    {
      "name" : "Step 3",
      "needs" : [
        {
          "name" : "Product BF",
          "qty" : 20,
        },
        {
          "name" : "Product BG",
          "qty" : 20,
        },
      ]
    },
  ]
});
