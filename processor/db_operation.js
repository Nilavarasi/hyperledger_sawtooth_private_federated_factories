class DBOperations {
    constructor(BankTransaction) {
        this.bank_operations = BankTransaction
    }
    insertCustomer(data) {
        const customer_id = data['customer_id'];
        const customer_name = data['customer_name'];
        const public_key = data['public_key'];
        const bank_name = data['bank_name'];
        const amount = data['amount'];
        
        if(customer_id && customer_name && public_key && bank_name) {
            const insert_customer_query = `insert into customers (customer_id, customer_name, public_key,bank_name, balance) VALUES (?, ?, ? ,?, ?)`;
            return this.bank_operations.run(
                insert_customer_query,
                [
                    customer_id, customer_name, public_key, bank_name, amount
                ]);
        } else {
            return "Column missing"
        }
    }
    insertTranasaction(data) {
        const customer_id = data['customer_id'];
        const transaction_name = data['transaction_name'];
        const transaction_hash = data['transaction_hash'];
        const amount = data['amount'];

        if (customer_id && transaction_name && transaction_hash) {
            const insert_transaction_query = `insert into transactions (transaction_id, customer_id, transaction_name, amount, transaction_hash) VALUES (?, ?, ?, ? , ?)`;
            return this.bank_operations.run(
                insert_transaction_query,[
                    transaction_hash, customer_id, transaction_name, amount, transaction_hash
                ]);
        } else {
            return "Column missing"
        }
    }
    updateUserBalance(data) {
        const customer_id = data['customer_id'];
        const amount = data['amount'];
        if (customer_id || amount) {
            const update_balance_query = `UPDATE customer SET amount = ? WHERE customer_id = ?`;
            return this.bank_operations.run(
                update_balance_query, [customer_id, amount]
            );
        } else {
            return "Column missing"
        }
    }

    getAllUserTransaction(id) {
        this.bank_operations.all(
            `SELECT * FROM transactions WHERE customer_id = ?`,
            [id]).then(data => {
                return data
            })
    }

    getUser(id) {
        return this.bank_operations.all(
            `SELECT * FROM customers WHERE customer_id = ?`,
            [id]).then(data => {
                return data
            })
    }

}

module.exports = DBOperations;