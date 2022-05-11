const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const KeyManager = require('./keymanager');
const { prepareTransactions } = require('./prepareTransaction')
const { SubmitToServer } = require('./sumitToServer.js')
const env = require('../shared/env')
const BankTransaction = require('./db')
const DBOperations = require('./db_operation');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbFilePath = env['dbFilePath']
const bank_transactions = new BankTransaction(dbFilePath)
const db_operations = new DBOperations(bank_transactions)


var keyManager = new KeyManager();
db_operations.createTables();
function keyCheck(username) {
    if (keyManager.doesKeyExist(username)) {
        console.log("keys are already created for" + username);

    } else {
        var output = keyManager.createkeys(username);
        keyManager.savekeys(username, output);
    }
}

function callSubmitServer(username, payload) {
    if (keyManager.doesKeyExist(username)) {
        if (batchlistBytes = prepareTransactions(payload, username)) {
            return SubmitToServer(batchlistBytes).then(res => {
                console.log("server res", res);
                return res;
            })
        }
    }
}

function sendResponse(res, data, statusCode) {
    res.statusCode = statusCode;
    res.setHeader('content-Type', 'Application/json');
    res.end(JSON.stringify(data))
}

function updateTransHash(customer_id, last_amount, transcation_hash, last_transaction_name) {
    const transact_data = {
        "customer_id": customer_id,
        "transaction_hash": transcation_hash,
        "last_amount": last_amount,
        "last_transaction_name": last_transaction_name
    }
    return db_operations.updateTransactionHash(transact_data)
}

function getHashFromStr(str) {
    const splited_first_str = str["link"].split("/")[str["link"].split("/").length - 1];
    return splited_first_str.split("=")[splited_first_str.split("=").length - 1]
}

routes = () => {
    app.post('/signup', function (req, res, next) {
        const data = req.body;
        console.log("parsed data", data)

        const username = data['customer_name']
        const password = data['password']
        if (keyManager.doesKeyExist(username)) {
            res.statusCode = 403;
            res.setHeader('content-Type', 'Application/json');
            res.end("User Exists")
        }
        var output = keyManager.createkeys(username, password);
        keyManager.savekeys(username, output);
        const customer_id = keyManager.readpublickey(username);
        const payload = {
            "verb": "create_account",
            "customer_id": customer_id,
            "customer_name": username,
            "savings_balance": 0,
            "checking_balance": 0,
            "bank_name": data['bank_name']
        }
        callSubmitServer(username, payload)
            .then(calRes => {
                let createUserResponse = null;
                db_operations.getUser(customer_id).then(data => {
                    createUserResponse = data;
                    var response = [
                        {
                            "message": "successfully registered user",
                            "user": createUserResponse
                        },
                    ];
                    res.statusCode = 200;
                    res.setHeader('content-Type', 'Application/json');
                    res.end(JSON.stringify(response))
                });
            })
    })
    app.post('/withdraw', function (req, res, next) {
        const data = req.body;
        const username = data['customer_name']
        keyCheck(username)
        let transcation_hash = null;
        callSubmitServer(username, data)
            .then(callSubRes => {
                console.log("callSubRes", callSubRes)
                transcation_hash = getHashFromStr(JSON.parse(callSubRes))
                console.log("transaction_hash", transcation_hash)
                const customer_id = data['customer_id']
                let withdrawRes = null
                db_operations.getUser(customer_id).then(data => {
                    withdrawRes = data;
                    var response = [
                        {
                            "user": withdrawRes,
                            "transcation_hash": transcation_hash
                        },
                    ];
                    sendResponse(res, response, 200)
                });
            })

    })
    app.post('/transfer', function (req, res, next) {
        const data = req.body;
        console.log("parsed data", data)
        const username = data['customer_name']
        keyCheck(username)
        let transcation_hash = null
        callSubmitServer(username, data)
            .then(callSubRes => {
                console.log("callSubRes", callSubRes)
                transcation_hash = getHashFromStr(JSON.parse(callSubRes))
                console.log("transcation_hash", transcation_hash)
                const customer_id = data['source_customer_id']
                let transferResponse = null;
                db_operations.getUser(customer_id).then(data => {
                    transferResponse = data;
                    var response = [
                        {
                            "user": transferResponse,
                            "transaction_hash": transcation_hash
                        },
                    ];
                    sendResponse(res, response, 200)
                });
            })

    })
    app.post('/balance', function (req, res, next) {
        data = req.body;
        console.log("parsed data", data)
        const username = data['customer_name']
        keyCheck(username)
        let accountBalRes = null;
        db_operations.getUser(data['customer_id']).then(data => {
            accountBalRes = data;
            var response = [
                {
                    "message": accountBalRes
                },
            ];
            sendResponse(res, response, 200)
        });
    })
    app.post('/login', function (req, res, next) {
        const data = req.body;
        console.log("parsed data", data)
        const username = data['customer_name']
        const password = data['password']
        if (keyManager.doesKeyExist(username)) {
            if (keyManager.isAuthorizedUser(username, password)) {
                console.log("keys are already created for" + username);
                let user_data = null;
                db_operations.getUser(data['customer_id']).then(data => {
                    user_data = data;
                    var response = [
                        {
                            "message": "Successfully logged In",
                            "user": user_data
                        },
                    ];
                    res.statusCode = 200;
                });
            } else {
                var response = [
                    {
                        "message": "Unauthorized User. Wrong Credentials."
                    },
                ];
                res.statusCode = 403;
            }

        } else {
            var response = [
                {
                    "message": "User not found"
                },
            ];
            res.statusCode = 401;
        }
        res.setHeader('content-Type', 'Application/json');
        res.end(JSON.stringify(response))
    })
    app.post('/update_hash', function (req, res, next) {
        const data = req.body;
        console.log("parsed data", data)
        const customer_id = data['customer_id'];
        const last_amount = data['last_amount'];
        const transaction_hash = data['transaction_hash']
        const last_transaction_name = data['last_transaction_name'];
        updateTransHash(customer_id, last_amount, transaction_hash, last_transaction_name)
        .then(update_trans_res => {
            console.log(update_trans_res)
        })
    })
    app.post('/user', function (req, res, next) {
        data = req.body;
        console.log("parsed data", data)
        const username = data['customer_name']
        if (keyManager.doesKeyExist(username)) {
            let userRes = null;
            const customer_id = keyManager.readpublickey(username);
            db_operations.getUser(customer_id).then(data => {
                userRes = data;
                var response = [
                    {
                        "message": userRes
                    },
                ];
                sendResponse(res, response, 200)
            });
        } else {
            var response = [
                {
                    "message": "Cannot find user"
                },
            ];
            res.statusCode = 200;
            res.setHeader('content-Type', 'Application/json');
            res.end(JSON.stringify(response))
        }

    })
    app.listen(3000, () => console.log(`Started server at http://localhost:3000!`))
}

module.exports = { routes }
