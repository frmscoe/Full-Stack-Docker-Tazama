// SPDX-License-Identifier: Apache-2.0

const db = require("@arangodb").db;

const systemDb = "_system";

let configData = [
  {
    _key: "901@1.0.0@1.0.0",
    _id: "configuration/901",
    id: "901@1.0.0",
    cfg: "1.0.0",
    desc: "Number of outgoing transactions - debtor",
    config: {
      parameters: {
        maxQueryRange: 86400000,
      },
      exitConditions: [
        {
          subRuleRef: ".x00",
          reason: "Incoming transaction is unsuccessful",
        },
      ],
      bands: [
        {
          subRuleRef: ".01",
          upperLimit: 2,
          reason: "The debtor has performed one transaction to date",
        },
        {
          subRuleRef: ".02",
          lowerLimit: 2,
          upperLimit: 4,
          reason: "The debtor has performed two or three transactions to date",
        },
        {
          subRuleRef: ".03",
          lowerLimit: 4,
          reason: "The debtor has performed 4 or more transactions to date",
        },
      ],
    },
  },
];

let typologyExpData = [
  {
    _key: "999@1.0.0",
    _id: "typologyExpression/999",
    typology_name: "Rule-901 Typology",
    id: "typology-processor@1.0.0",
    cfg: "999@1.0.0",
    workflow: {
      alertThreshold: 200,
      interdictionThreshold: 400,
    },
    rules: [
      {
        id: "901@1.0.0",
        cfg: "1.0.0",
        ref: ".err",
        wght: "100",
      },
      {
        id: "901@1.0.0",
        cfg: "1.0.0",
        ref: ".x00",
        wght: "100",
      },
      {
        id: "901@1.0.0",
        cfg: "1.0.0",
        ref: ".01",
        wght: "100",
      },
      {
        id: "901@1.0.0",
        cfg: "1.0.0",
        ref: ".02",
        wght: "200",
      },
      {
        id: "901@1.0.0",
        cfg: "1.0.0",
        ref: ".03",
        wght: "400",
      },
    ],
    expression: {
      operator: "+",
      terms: [
        {
          id: "901@1.0.0",
          cfg: "1.0.0",
        },
      ],
    },
  },
];

// Config DB
const configDbName = "Configuration";
// Config Collections
const configColName = "configuration";
const typologyColName = "typologyExpression";

// Config Setup
db._useDatabase(systemDb);

db._createDatabase(configDbName);
db._useDatabase(configDbName);

db._create(configColName);
db._create(typologyColName);

// Indexes
// None

// Populate
db._collection(configColName).save(configData);
db._collection(typologyColName).save(typologyExpData);
