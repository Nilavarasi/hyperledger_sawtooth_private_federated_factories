var http = require('http');
const  KeyManager = require('./keymanager');
const {prepareTransactions} = require('./prepareTransaction')
const {SubmitToServer} = require('./sumitToServer.js')

//create a server object:
routes = () => {
    http.createServer(function (req, res) {
        var url = req.url;
        console.log('url', url)
        if (url === '/deposit') {
            var response = [
                {
                    "message": "Deposited the money"
                },
            ];
            res.statusCode = 200;
            res.setHeader('content-Type', 'Application/json');
            res.end(JSON.stringify(response))
        } else if (url === '/withdraw') {
            var response = [
                {
                    "message": "Withdraw the money"
                },
            ];
            res.statusCode = 200;
            res.setHeader('content-Type', 'Application/json');
            res.end(JSON.stringify(response))
        } else if (url === '/transfer') {
            var response = [
                {
                    "message": "Transfer the money"
                },
            ];
            res.statusCode = 200;
            res.setHeader('content-Type', 'Application/json');
            res.end(JSON.stringify(response))
        } else if (url === '/balance') {
            var response = [
                {
                    "message": "Account Balance"
                },
            ];
            res.statusCode = 200;
            res.setHeader('content-Type', 'Application/json');
            res.end(JSON.stringify(response))
        }  else if (url === '/login') {
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
            if(keyManager.doesKeyExist(username)){
                if(batchlistBytes=prepareTransactions(payload,username)){
                SubmitToServer(batchlistBytes);
                }
            }
            res.setHeader('content-Type', 'Application/json');
            res.end(JSON.stringify(response))
        }  else if (url === '/signup') {
            var output = keyManager.createkeys(username);
            keyManager.savekeys(username,output);
            if(keyManager.doesKeyExist(username)){
                if(batchlistBytes=prepareTransactions(payload,username)){
                SubmitToServer(batchlistBytes);
                }
            }
            var response = [
                {
                    "message": "Successfully Created the account"
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