const db = require("@arangodb").db;

const systemDb = "_system";
// TransactionHistory DB
const transactionHistoryDbName = "transactionHistory";
// TransactionHistory Collections
const transactionHistoryPacs002ColName = "transactionHistoryPacs002";
const transactionHistoryPacs008ColName = "transactionHistoryPacs008";
const transactionHistoryPain001ColName = "transactionHistoryPain001";
const transactionHistoryPain013ColName = "transactionHistoryPain013";
// const transactionsColName = "transactions";

// TransactionHistory Setup
db._useDatabase(systemDb);

db._createDatabase(transactionHistoryDbName);
db._useDatabase(transactionHistoryDbName);

db._create(transactionHistoryPacs002ColName);
db._create(transactionHistoryPacs008ColName);
db._create(transactionHistoryPain001ColName);
db._create(transactionHistoryPain013ColName);
// db._create(transactionsColName);

// Indexes
// Pacs002
db._collection(transactionHistoryPacs002ColName).ensureIndex({
  type: "persistent",
  fields: ["EndToEndId"],
  name: "pi_EndToEndId",
  unique: true,
  sparse: false,
  deduplicate: false,
  estimates: true,
  cacheEnabled: true,
  inBackground: false,
});

// Pacs008
db._collection(transactionHistoryPacs008ColName).ensureIndex({
  type: "persistent",
  fields: ["EndToEndId"],
  name: "pi_EndToEndId",
  unique: true,
  sparse: false,
  deduplicate: false,
  estimates: true,
  cacheEnabled: true,
  inBackground: false,
});

db._collection(transactionHistoryPacs008ColName).ensureIndex({
  type: "persistent",
  fields: ["DebtorAcctId"],
  name: "pi_DebtorAcctId",
  unique: true,
  sparse: false,
  deduplicate: false,
  estimates: true,
  cacheEnabled: true,
  inBackground: false,
});

db._collection(transactionHistoryPacs008ColName).ensureIndex({
  type: "persistent",
  fields: ["CreditorAcctId"],
  name: "pi_CreditorAcctId",
  unique: true,
  sparse: false,
  deduplicate: false,
  estimates: true,
  cacheEnabled: true,
  inBackground: false,
});

db._collection(transactionHistoryPacs008ColName).ensureIndex({
  type: "persistent",
  fields: ["CreDtTm"],
  name: "pi_CreDtTm",
  unique: true,
  sparse: false,
  deduplicate: false,
  estimates: true,
  cacheEnabled: true,
  inBackground: false,
});

db._collection(transactionHistoryPacs008ColName).ensureIndex({
  type: "persistent",
  fields: ["FIToFICstmrCdt.CdtTrfTxInf.PmtId.EndToEndId"],
  name: "pi_PmtId-EndToEndId",
  unique: true,
  sparse: false,
  deduplicate: false,
  estimates: true,
  cacheEnabled: true,
  inBackground: false,
});

db._collection(transactionHistoryPacs008ColName).ensureIndex({
  type: "persistent",
  fields: ["FIToFICstmrCdt.CdtTrfTxInf.DbtrAcct.Id.Othr.Id", "TxTp"],
  name: "pi_DbtrAcct_ID-TxTp",
  unique: true,
  sparse: false,
  deduplicate: false,
  estimates: true,
  cacheEnabled: true,
  inBackground: false,
});

// Pain001
db._collection(transactionHistoryPain001ColName).ensureIndex({
  type: "persistent",
  fields: ["EndToEndId"],
  name: "pi_EndToEndId",
  unique: true,
  sparse: false,
  deduplicate: false,
  estimates: true,
  cacheEnabled: true,
  inBackground: false,
});

db._collection(transactionHistoryPain001ColName).ensureIndex({
  type: "persistent",
  fields: ["DebtorAcctId"],
  name: "pi_DebtorAcctId",
  unique: true,
  sparse: false,
  deduplicate: false,
  estimates: true,
  cacheEnabled: true,
  inBackground: false,
});

db._collection(transactionHistoryPain001ColName).ensureIndex({
  type: "persistent",
  fields: ["CreditorAcctId"],
  name: "pi_CreditorAcctId",
  unique: true,
  sparse: false,
  deduplicate: false,
  estimates: true,
  cacheEnabled: true,
  inBackground: false,
});

db._collection(transactionHistoryPain001ColName).ensureIndex({
  type: "persistent",
  fields: ["CreDtTm"],
  name: "pi_CreDtTm",
  unique: true,
  sparse: false,
  deduplicate: false,
  estimates: true,
  cacheEnabled: true,
  inBackground: false,
});

db._collection(transactionHistoryPain001ColName).ensureIndex({
  type: "persistent",
  fields: ["CstmrCdtTrfInitn.PmtInf.DbtrAcct.Id.Othr.Id", "TxTp"],
  name: "pi__DbtrAcct_Id_Othr_Id-TxTp",
  unique: true,
  sparse: false,
  deduplicate: false,
  estimates: true,
  cacheEnabled: true,
  inBackground: false,
});

db._collection(transactionHistoryPain001ColName).ensureIndex({
  type: "persistent",
  fields: ["CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf.PmtId.EndToEndId"],
  name: "pi_PmtId-EndToEndId",
  unique: true,
  sparse: false,
  deduplicate: false,
  estimates: true,
  cacheEnabled: true,
  inBackground: false,
});

// Pain013
db._collection(transactionHistoryPain013ColName).ensureIndex({
    type: "persistent",
    fields: ["EndToEndId"],
    name: "pi_EndToEndId",
    unique: true,
    sparse: false,
    deduplicate: false,
    estimates: true,
    cacheEnabled: true,
    inBackground: false,
  });