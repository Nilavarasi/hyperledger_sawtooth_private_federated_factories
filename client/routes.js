var http = require('http');
const KeyManager = require('./keymanager');
const { prepareTransactions } = require('./prepareTransaction')
const { SubmitToServer } = require('./sumitToServer.js')
const env = require('../shared/env')
const BankTransaction = require('./db')
const DBOperations = require('./db_operation');


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
    // const last_transaction = db_operations.getUserLastTransaction(customer_id)
    // console.log("last_transaction", last_transaction)
    // let last_transaction_id = 0
    // if (last_transaction && last_transaction.length > 0) {
    //     last_transaction_id = last_transaction[0]['transaction_id']
    // }
    const transact_data = {
        "customer_id": customer_id,
        "transaction_hash": transcation_hash,
        "last_amount": last_amount,
        "last_transaction_name": last_transaction_name
    }
    return db_operations.updateTransactionHash(transact_data)
}

function getHashFromStr (str) {
    const splited_first_str = str["link"].split("/")[str["link"].split("/").length - 1];
    return splited_first_str.split("=")[splited_first_str.split("=").length - 1]
}
//create a server object:
routes = () => {
    http.createServer(function (req, res) {
        const url = req.url;
        let data = []

        if (url === '/deposit' && req.method == 'POST') {
            req.on('data', (chunk) => {
                data.push(chunk)
            })
            req.on('end', () => {
                data = JSON.parse(data)
                console.log("parsed data", data)
                const username = data['customer_name']
                keyCheck(username)
                let transcation_hash = null;
                callSubmitServer(username, data).then(callSubRes => {
                    console.log("callSubRes", callSubRes)
                    transcation_hash = getHashFromStr(JSON.parse(callSubRes))
                    console.log("transcation_hash", transcation_hash)
                    const customer_id = data['customer_id']
                    // updateTransHash(customer_id, transcation_hash).then(update_data => {
                        console.log("updated_data", update_data)
                        let deposit_res = null;
                        db_operations.getUser(customer_id).then(data => {
                            deposit_res = data
                            var response = [
                                {
                                    "message": deposit_res
                                },
                            ];
                            sendResponse(res, response, 200)
                        // });
                    })
                })
            });

        }


        else if (url === '/withdraw' && req.method == 'POST') {
            req.on('data', (chunk) => {
                data.push(chunk)
            })
            req.on('end', () => {
                data = JSON.parse(data)
                console.log("parsed data", data)
                const username = data['customer_name']
                keyCheck(username)
                let transcation_hash = null;
                callSubmitServer(username, data)
                    .then(callSubRes => {
                        console.log("callSubRes", callSubRes)
                        transcation_hash = getHashFromStr(JSON.parse(callSubRes))
                        console.log("transcation_hash", transcation_hash)
                        // subRes = JSON.parse(subRes)
                        // transcation_hash = subRes["link"].split("/")[-1];
                        const customer_id = data['customer_id']
                        // updateTransHash(customer_id, transcation_hash).then(update_data => {
                            let withdrawRes = null
                            db_operations.getUser(customer_id).then(data => {
                                withdrawRes = data;
                                var response = [
                                    {
                                        "message": withdrawRes
                                    },
                                ];
                                sendResponse(res, response, 200)
                            });
                        // })
                    })

            });
        }

        else if (url === '/transfer' && req.method == 'POST') {
            req.on('data', (chunk) => {
                data.push(chunk)
            })
            req.on('end', () => {
                data = JSON.parse(data)
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
                        // updateTransHash(customer_id, transcation_hash)
                        //     .then(update_data => {
                                let transferResponse = null;
                                db_operations.getUser(customer_id).then(data => {
                                    transferResponse = data;
                                    var response = [
                                        {
                                            "message": transferResponse
                                        },
                                    ];
                                    sendResponse(res, response, 200)
                                });
                            // })

                    })

            });
        }

        else if (url === '/balance' && req.method == 'GET') {
            req.on('data', (chunk) => {
                data.push(chunk)
            })
            req.on('end', () => {
                data = JSON.parse(data)
                console.log("parsed data", data)
                const username = data['customer_name']
                keyCheck(username)
                callSubmitServer(username, data).then(calRes => {
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

            });
        }

        else if ((url === '/login') && req.method == 'POST') {

            req.on('data', (chunk) => {
                data.push(chunk)
            })
            req.on('end', () => {
                data = JSON.parse(data)
                console.log("parsed data", data)
                const username = data['customer_name']
                const password = data['password']
                if (keyManager.doesKeyExist(username)) {
                    if(keyManager.isAuthorizedUser(username, password)){
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
                    }   else {
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
        }

        else if (url === '/signup') {
            req.on('data', (chunk) => {
                data.push(chunk)
            })
            req.on('end', () => {
                data = JSON.parse(data)
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
        } else if((url === '/update_hash') && req.method == 'POST') {
            req.on('data', (chunk) => {
                data.push(chunk)
            })
            req.on('end', () => {
                data = JSON.parse(data)
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
        }else {
            res.statusCode = 402;
            res.setHeader('content-Type', 'Application/json');
            res.end("Unknown request")
        }
    }).listen(3000, function () {
        console.log("server start at port 3000"); //the server object listens on port 3000
    });
}

module.exports = { routes }
