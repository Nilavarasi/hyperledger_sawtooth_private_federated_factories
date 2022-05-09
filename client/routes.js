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
        return SubmitToServer(batchlistBytes);
        }
    }
}

function sendResponse(res, data, statusCode) {
    res.statusCode = statusCode;
    res.setHeader('content-Type', 'Application/json');
    res.end(JSON.stringify(data))
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
                callSubmitServer(username, data)
                const deposit_res = db_operations.getUser(data.get['customer_id']).then(data =>{
                    return data
                });
                var response = [
                    {
                        "message": deposit_res
                    },
                ];
                sendResponse(res, response, 200)
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
                callSubmitServer(username, data)
                const withdrawRes = db_operations.getUser(data.get['customer_id']).then(data =>{
                    return data
                });
                var response = [
                    {
                        "message": withdrawRes
                    },
                ];
                sendResponse(res, response, 200)
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
                callSubmitServer(username, data)
                const transferResponse = db_operations.getUser(data.get['customer_id']).then(data =>{
                    return data
                });
                var response = [
                    {
                        "message": transferResponse
                    },
                ];
                sendResponse(res, response, 200)
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
                callSubmitServer(username, data)
                const accountBalRes = db_operations.getUser(data.get['customer_id']).then(data =>{
                    return data
                });
                var response = [
                    {
                        "message": accountBalRes
                    },
                ];
                sendResponse(res, response, 200)
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
                    const user_data = db_operations.getUser(data.get['customer_id']).then(data =>{
                        return data
                    });
                    var response = [
                        {
                            "message": "Successfully logged In",
			                "user": user_data
                        },
                    ];
                    res.statusCode = 200;
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
                const payload = {
                    "verb":"create_account",
                    "customer_id": keyManager.readpublickey(username),
                    "customer_name":username,
                    "savings_balance":0,
                    "checking_balance":0
                }
                callSubmitServer(username, payload)
                const createUserResponse = db_operations.getUser(data.get['customer_id']).then(data =>{
                    return data
                });
                var response = [
                    {
                        "message": "successfully registered user",
                        "user": {"user_id": createUserResponse}
                    },
                ];
                res.statusCode = 200;
                res.setHeader('content-Type', 'Application/json');
                res.end(JSON.stringify(response))
            })
        }
    }).listen(3000, function () {
        console.log("server start at port 3000"); //the server object listens on port 3000
    });
}

module.exports = { routes }
