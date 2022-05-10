var http = require('http');
const  KeyManager = require('./keymanager');
const {prepareTransactions} = require('./prepareTransaction')
const {SubmitToServer} = require('./sumitToServer.js')
const env = require('../shared/env')
const BankTransaction = require('./db')
const  DBOperations = require('./db_operation');


const dbFilePath = env['dbFilePath']
const bank_transactions = new BankTransaction(dbFilePath)
const db_operations = new DBOperations(bank_transactions)


var keyManager = new KeyManager();
db_operations.createTables();
function keyCheck(username) {
    if(keyManager.doesKeyExist(username)){
        console.log("keys are already created for"+username);
    
    }else{
        var output = keyManager.createkeys(username);
        keyManager.savekeys(username,output);
    }
}

function callSubmitServer(username, payload){
    if(keyManager.doesKeyExist(username)){
        if(batchlistBytes=prepareTransactions(payload,username)){
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

function updateTransHash(customer_id, transcation_hash) {
    const last_transaction = db_operations.getUserLastTransaction(customer_id)
    console.log("last_transaction", last_transaction)
    let last_transaction_id = 0
    if(last_transaction && last_transaction.length > 0) {
        last_transaction_id = last_transaction[0]['transaction_id']
    }
    const transact_data = {
        "customer_id": customer_id,
        "transaction_hash": transcation_hash,
        "transaction_id": last_transaction_id
    }
    db_operations.updateTransactionHash(transact_data)
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
                    transcation_hash = callSubRes;
                    const customer_id = data['customer_id']
                    updateTransHash(customer_id, transcation_hash)
                    let deposit_res = null;
                    db_operations.getUser(customer_id).then(data =>{
                        deposit_res =  data
                        var response = [
                            {
                                "message": deposit_res
                            },
                        ];
                        sendResponse(res, response, 200)
                    });
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
                .then(subRes=> {
                    transcation_hash = subRes;
                    const customer_id = data['customer_id']
                    updateTransHash(customer_id, transcation_hash)
                    const withdrawRes = null
                    db_operations.getUser(customer_id).then(data =>{
                        withdrawRes = data;
                        var response = [
                            {
                                "message": withdrawRes
                            },
                        ];
                        sendResponse(res, response, 200)
                    });
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
                .then(calRes => {
                    transcation_hash = calRes;
                    const customer_id = data['customer_id']
                    updateTransHash(customer_id, transcation_hash)
                    let transferResponse = null;
                    db_operations.getUser(customer_id).then(data =>{
                        transferResponse =  data;
                        var response = [
                            {
                                "message": transferResponse
                            },
                        ];
                        sendResponse(res, response, 200)
                    });
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
                    db_operations.getUser(data['customer_id']).then(data =>{
                        accountBalRes =  data;
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
                if(keyManager.doesKeyExist(username)){
                    console.log("keys are already created for"+username);
                    let user_data = null;
                    db_operations.getUser(data['customer_id']).then(data =>{
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
                var output = keyManager.createkeys(username);
                keyManager.savekeys(username,output);
                const customer_id = keyManager.readpublickey(username);
                const payload = {
                    "verb":"create_account",
                    "customer_id": customer_id,
                    "customer_name":username,
                    "savings_balance":0,
                    "checking_balance":0,
                    "bank_name": data['bank_name']
                }
                callSubmitServer(username, payload)
                .then(calRes => {
                    let createUserResponse = null;
                    db_operations.getUser(customer_id).then(data =>{
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
        } else {
            res.statusCode = 402;
            res.setHeader('content-Type', 'Application/json');
            res.end("Unknown request")
        }
    }).listen(3000, function () {
        console.log("server start at port 3000"); //the server object listens on port 3000
    });
}

module.exports = { routes }
