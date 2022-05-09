var http = require('http');
const  KeyManager = require('./keymanager');
const {prepareTransactions} = require('./prepareTransaction')
const {SubmitToServer} = require('./sumitToServer.js')

var keyManager = new KeyManager();

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
                const deposit_res = callSubmitServer(username, data)
                var response = [
                    {
                        "message": deposit_res
                    },
                ];
                sendResponse(res, response, 200)
            });
            
        } else if (url === '/withdraw' && req.method == 'POST') {
            req.on('data', (chunk) => {
                data.push(chunk)
            })
            req.on('end', () => {
                data = JSON.parse(data)
                console.log("parsed data", data)
                const username = data['customer_name']
                keyCheck(username)
                const withdrawRes = callSubmitServer(username, data)
                var response = [
                    {
                        "message": withdrawRes
                    },
                ];
                sendResponse(res, response, 200)
            });
        } else if (url === '/transfer' && req.method == 'POST') {
            req.on('data', (chunk) => {
                data.push(chunk)
            })
            req.on('end', () => {
                data = JSON.parse(data)
                console.log("parsed data", data)
                const username = data['customer_name']
                keyCheck(username)
                const transferResponse = callSubmitServer(username, data)
                var response = [
                    {
                        "message": transferResponse
                    },
                ];
                sendResponse(res, response, 200)
            });
        } else if (url === '/balance' && req.method == 'GET') {
            req.on('data', (chunk) => {
                data.push(chunk)
            })
            req.on('end', () => {
                data = JSON.parse(data)
                console.log("parsed data", data)
                const username = data['customer_name']
                keyCheck(username)
                const accountBalRes = callSubmitServer(username, data)
                var response = [
                    {
                        "message": accountBalRes
                    },
                ];
                sendResponse(res, response, 200)
            });
        }  else if ((url === '/login') && req.method == 'POST') {
            if(keyManager.doesKeyExist(username)){
                console.log("keys are already created for"+username);
                var response = [
                    {
                        "message": "Successfully logged In"
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
        }  else if (url === '/signup') {
            var output = keyManager.createkeys(username);
            keyManager.savekeys(username,output);
            const payload = {
                "verb":"create_account",
                "customer_id":username+"001",
                "customer_name":username,
                "savings_balance":0,
                "checking_balance":0
            }
            const createUserResponse = callSubmitServer(username, payload)
            var response = [
                {
                    "message": createUserResponse
                },
            ];
            res.statusCode = 200;
            res.setHeader('content-Type', 'Application/json');
            res.end(JSON.stringify(response))
        }
    }).listen(3000, function () {
        console.log("server start at port 3000"); //the server object listens on port 3000
    });
}

module.exports = { routes }