const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction, InternalError } = require('sawtooth-sdk/processor/exceptions')
const cbor = require('cbor')
const env = require('../shared/env');
// const SimpleStoreState = require('./state');
const { get_account_address } = require('../shared/Addressing')
const BankTransaction = require('./db')
const  DBOperations = require('./db_operation');

const dbFilePath = env['dbFilePath']
const bank_transactions = new BankTransaction(dbFilePath)
const db_operations = new DBOperations(bank_transactions)
db_operations.createTables();
const encode = obj => Buffer.from(JSON.stringify(obj))
const decode = buf => JSON.parse(buf);

class SmallBankHandler extends TransactionHandler {

    constructor() {
        super(env.familyName, [env.familyVersion], [env.TP_NAMESPACE])
        this.signer_public_keys = "";
    }

    get_account(customer_id, state) {
        let address = get_account_address(customer_id)
        if (!address) {
            throw InvalidTransaction("Failed to load Account: {:?}", err)
        } else {
            return state.getState([address]).then((result) => {
                console.log(result);
            }).catch((err) => {
                console.log("no account found");
            })
        }
    }

    create_account(state, id, name, savings, checking, public_key, bank_name) {
        let new_account_data = this.make_Account_To_JSON(id, name, savings, checking)
        const insert_data = {
            "customer_id": id,
            "customer_name": name,
            "balance": savings,
            "public_key": public_key,
            "bank_name": bank_name
        }
        db_operations.getUser(id).then(data => {
            if (data.length ==  0) {
                db_operations.insertCustomer(insert_data).then(data=>{
                    console.log("inserted customer db id", data);
                })
            }
        })
        return this.save_account(state, new_account_data, id)

    }

    transfer_money(source_customer_id, dest_customer_id, amountToTransfer,state) {
        let source_account  = get_account_address(source_customer_id);
        let dest_account = get_account_address(dest_customer_id);
        if (!source_account && !dest_account)
            throw new InvalidTransaction("Both source and dest accounts must exist")
         else {
             return state.getState([source_account]).then((stateEntries) => {
                const entry = stateEntries[source_account]
                let srcaccount = decode(entry);
                if (srcaccount.customer_id != source_customer_id){
                    throw new InvalidTransaction('Only an account owner should transfer money');
                }
                var srcbalance = srcaccount.account.checking_balance;
                if (srcbalance < amountToTransfer) {
                    throw new InvalidTransaction(`Insufficient funds in source checking account ${srcbalance}`)
                }else{
                return state.getState([dest_account]).then((stateEntries) => {
                    const entry = stateEntries[dest_account];
                    let destacount = decode(entry);
                    let srcbalance1 = srcbalance - amountToTransfer;
                    srcaccount.account.checking_balance =srcbalance1;
                    let dstbalance=destacount.account.checking_balance;
                    dstbalance= dstbalance + amountToTransfer;
                    destacount.account.checking_balance = dstbalance;
                    console.log(destacount.account);
                    console.log(srcaccount.account);
                    return state.setState({
                        [source_account]: encode(srcaccount, source_customer_id)
                    }).then((result) => {
                        console.log("amount is debited from"+result)
                        return state.setState({
                            [dest_account]: encode(destacount, dest_customer_id)
                        }).then((result) => {
                            const last_transaction = db_operations.getUserLastTransaction(customer_id)
                            console.log("last_transaction", last_transaction)
                            let last_transaction_id = 0
                            if(last_transaction.length > 0) {
                                last_transaction_id = last_transaction[0]['transaction_id']
                            }
                            const insert_data = {
                                "transaction_id": last_transaction_id + 1,
                                "customer_id": srcaccount.account,
                                "dest_account": destacount.account,
                                "transaction_name": "transfer",
                                "amount": amountToTransfer,
                                "transaction_hash": 'transaction_hash'
                            }
                            db_operations.insertTranasaction(insert_data)
                            .then(data => {
                                db_operations.updateUserBalance({'customer_id': srcaccount.account, 'amount': srcbalance1})
                                .then(res1 => {
                                    db_operations.updateUserBalance({'customer_id': destacount.account, 'amount': dstbalance})
                                    .then(data=> {
                                        console.log("the amount is credited to " + result)
                                        let entry = stateEntries[source_account]
                                        let srcaccount = decode(entry);
                                        entry = stateEntries[dest_account];
                                        let destacount = decode(entry);
                                        return {
                                            "source_account": srcaccount,
                                            "dest_account": destacount
                                        }
                                    })
                                })
                            })
                            
                        }).catch((err) => {
                            console.log(err);
                        })
                    }).catch((err) => {
                        console.log(err);
                    })
  
                })
            }
        })
    }
    }

    withdraw_money(customer_id, amountToWithDraw, state) {
        let address = get_account_address(customer_id)
        if (!address) {
            throw InvalidTransaction("Failed to load Account: {:?}", err)
        } else {
            return state.getState([address]).then((stateEntries) => {
                const entry = stateEntries[address]
                let account = decode(entry);
                console.log("account" + entry);
                console.log(account.account);
                if (account.customer_id != customer_id) {
                    throw new InvalidTransaction('Only an account owner can deposit money');
                } else {

                    console.log(account.account.checking_balance);
                    let balance = account.account.checking_balance;
                    if (balance < amountToWithDraw) {
                        throw new InvalidTransaction(`Not enough money. The amount should be lesser or equal to ${balance}`)
                    } else {
                        let newBalance = account.account.checking_balance - amountToWithDraw;
                        console.log("newbalance" + newBalance);
                        account.account.checking_balance = newBalance;
                        console.log(account.customer_id);
                        console.log(account.account);
                        return state.setState({
                            [address]: encode(account, customer_id)
                        }).then((result) => {
                            console.log("the amount is debited" + result)
                            const last_transaction = db_operations.getUserLastTransaction(customer_id)
                            console.log("last_transaction", last_transaction)
                            let last_transaction_id = 0
                            if(last_transaction.length > 0) {
                                last_transaction_id = last_transaction[0]['transaction_id']
                            }
                            const insert_data = {
                                "transaction_id": last_transaction_id+1,
                                "customer_id": account.customer_id,
                                "dest_account": null,
                                "transaction_name": "withdraw",
                                "amount": amountToWithDraw,
                                "transaction_hash": 'ndjabja'
                            }
                            db_operations.insertTranasaction(insert_data)
                            .then(data => {
                                db_operations.updateUserBalance({'customer_id': customer_id, 'amount': newBalance})
                            })
                            const entry = stateEntries[address]
                            let account = decode(entry);
                            return account
                        }).catch((err) => {
                            console.log(err);
                        })
                    }
                }
            })

        }
    }

    deposit_money(customer_id, amountToDeposit, state) {

        let address = get_account_address(customer_id)
        if (!address) {
            throw InvalidTransaction("Failed to load Account: {:?}", err)
        } else {
            return state.getState([address]).then((stateEntries) => {
                const entry = stateEntries[address]
                let account = decode(entry);
                if (account.customer_id != customer_id) {
                    throw new InvalidTransaction('Only an account owner can deposit money');
                } else {
                    console.log("accountbalancebefore" + entry);
                    console.log(account.account.checking_balance);
                    let balance = account.account.checking_balance + amountToDeposit;
                    console.log("accountbalance" + balance);
                    account.account.checking_balance = balance;
                    console.log(account.customer_id);
                    console.log(account.account);
                    return state.setState({
                        [address]: encode(account, customer_id)
                    }).then((result) => {
                        console.log("the amount is credited")
                        const last_transaction = db_operations.getUserLastTransaction(customer_id)
                        console.log("last_transaction", last_transaction)
                        let last_transaction_id = 0
                        if(last_transaction.length > 0) {
                            last_transaction_id = last_transaction[0]['transaction_id']
                        }
                        const insert_data = {
                            "transaction_id": last_transaction_id +1,
                            "customer_id": account.customer_id,
                            "dest_account": null,
                            "transaction_name": "deposit",
                            "amount": amountToDeposit,
                            "transaction_hash": 'ndjabja'
                        }
                        db_operations.insertTranasaction(insert_data)
                        .then(data => {
                            db_operations.updateUserBalance({'customer_id': customer_id, 'amount': balance})
                        })
                        const entry = stateEntries[address]
                        let account = decode(entry);
                        return account
                    }).catch((err) => {
                        console.log(err);
                    })
                }
            })
        }
    }

    get_balance(customer_id, state) {

        let address = get_account_address(customer_id)
        if (!address) {
            throw InvalidTransaction("Failed to load Account: {:?}", err)
        } else {
            return state.getState([address]).then((stateEntries) => {
                const entry = stateEntries[address]
                let account = decode(entry);
                if (account.customer_id != customer_id) {
                    throw new InvalidTransaction('Only an account owner can deposit money');
                } else {
                    console.log("accountbalance" + entry);
                    console.log(account.account.checking_balance);
                    return account
                }
            })
        }
    }

    make_Account_To_JSON(id, name, savings, checking) {
        let account_data = {
            customer_id: id,
            customer_name: name,
            checking_balance: checking,
            savings_balance: savings,
            public_key: this.signer_public_key
        };
        return account_data;
    }

    save_account(state, account, customer_id) {
        let address = get_account_address(customer_id)
        console.log(address);
        console.log(account);
        return state.setState({
            [address]: encode({ account, customer_id })
        }).then((result) => {
            console.log(result);
            return address
        }).catch((err) => {
            console.log(err);
        })

    }

    apply(transactionProcessRequest, state) {
        let header = transactionProcessRequest.header;
        this.signer_public_key = header.signerPublicKey;
        let payload = cbor.decode(transactionProcessRequest.payload);
        console.log(payload);
        if (payload.verb === 'create_account') {
            this.create_account(state, payload.customer_id, payload.customer_name, payload.savings_balance, payload.checking_balance, this.signer_public_key, payload.bank_name)
            .then(create_account_resp => {
                console.log("create_account_resp", create_account_resp)
                    return create_account_resp
            })
        } else if (payload.verb === 'deposit_money') {
            this.deposit_money(payload.customer_id, payload.amount, state)
            .then(deposit_money_resp => {
                console.log("deposit_money_resp", deposit_money_resp)
                    return deposit_money_resp
            })
        } else if (payload.verb === 'withdraw_money') {
            this.withdraw_money(payload.customer_id, payload.amount, state)
            .then(withdraw_money_resp => {
                console.log("withdraw_money_resp", withdraw_money_resp)
                    return withdraw_money_resp
            })
        } else if (payload.verb === 'transfer_money') {
            this.transfer_money(payload.source_customer_id, payload.dest_customer_id, payload.amount, state)
            .then(transfer_money_resp => {
                console.log("transfer_money_resp", transfer_money_resp)
                    return transfer_money_resp
            })
        } else if (payload.verb === 'get_balance') {
            this.get_balance(payload.customer_id, state).then(get_balnce_resp => {
                console.log("get_balnce_resp", get_balnce_resp)
                    return get_balnce_resp
            })
    
        } else {
            throw new InvalidTransaction(`Didn't recognize Verb "${verb}".\nMust be one of "create_account,deposit_money,make_deposit,withdraw_money or transfer_money"`)
        }
    }
}

module.exports = SmallBankHandler;