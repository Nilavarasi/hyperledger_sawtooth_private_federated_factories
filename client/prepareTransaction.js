const env = require('../shared/env');
var { _hashforpayload } = require("../shared/Addressing");
const cbor = require('cbor')
const { protobuf } = require('sawtooth-sdk')
const { CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const  KeyManager = require('./keymanager');

function prepareTransactions(payload,username) {

  var keyManager = new KeyManager();
  var tempUserPublicKey = keyManager.readpublickey(username) 
  const payloadBytes = cbor.encode(payload)
  const privateKeyHex = "66ad89d0ff29b0267fba72ea8d40ef7975e10f8acde8d50d20cdf56ba9599c5e";
  const context = createContext('secp256k1');
  const secp256k1pk = Secp256k1PrivateKey.fromHex(privateKeyHex.trim());
  const signer = new CryptoFactory(context).newSigner(secp256k1pk);
  const publicKey = signer.getPublicKey().asHex();
  const address = env.familyName.substr(0, 6) + hash(publicKey).substr(0, 64);
  const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: env.familyName,
    familyVersion: env.familyVersion,
    inputs: [address],
    outputs: [address],
     signerPublicKey: tempUserPublicKey,
     batcherPublicKey: tempUserPublicKey,
    dependencies: [],
    payloadSha512: _hashforpayload(payloadBytes),
    nonce: (new Date()).toString()
  }).finish()
   
  
<<<<<<< HEAD
=======
  console.log("address", address)
>>>>>>> 17b1c3c89be22d0bb26652de5ab35fd0e74bcecf
  const signature = keyManager.sign(transactionHeaderBytes,username);

  const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: signature,
    payload: payloadBytes
  })

  const transactions = [transaction]

  const batchHeaderBytes = protobuf.BatchHeader.encode({
  signerPublicKey:tempUserPublicKey,
  transactionIds: transactions.map((txn) => txn.headerSignature),
  }).finish()

  headerSignature = keyManager.sign(batchHeaderBytes,username);

  const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: headerSignature,
    transactions: transactions
  })

  const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
  }).finish()

  return batchListBytes;
}

 module.exports = { prepareTransactions };




