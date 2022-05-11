class DBOperations {
    constructor(BankTransaction) {
        this.bank_operations = BankTransaction
    }

    createTables() {
        const customer_table_sql = `
        CREATE TABLE IF NOT EXISTS "customers"(customer_id text primary key not null, customer_name text not null, public_key text not null, bank_name text not null, balance int)`
        this.bank_operations.run(customer_table_sql)
        const transaction_table_sql = `
        CREATE TABLE IF NOT EXISTS transactions (transaction_id text primary key NOT NULL, customer_id TEXT NOT NULL, transaction_name TEXT NOT NULL, amount int null, transaction_hash text  null, dest_account text null)`
        this.bank_operations.run(transaction_table_sql)
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
        const transaction_id = data['transaction_id'];

        if (customer_id && transaction_name) {
            const insert_transaction_query = `insert into transactions (transaction_id, customer_id, transaction_name, amount, transaction_hash) VALUES (?, ?, ?, ? , ?)`;
            return this.bank_operations.run(
                insert_transaction_query,[
                    transaction_id, customer_id, transaction_name, amount, transaction_hash
                ]);
        } else {
            return "Column missing"
        }
    }
    updateUserBalance(data) {
        const customer_id = data['customer_id'];
        const amount = data['amount'];
        if (customer_id || amount) {
            const update_balance_query = `UPDATE customers SET balance = ? WHERE customer_id = ?`;
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


    getUserLastTransaction(customer_id) {
        this.bank_operations.all(
            `SELECT transaction_id FROM transactions WHERE customer_id = ? order by transaction_id desc limit 1`,
            [customer_id]).then(data => {
                return data
            })
    }

    getTransactionById(transaction_id) {
        return this.bank_operations.all(
            `SELECT * FROM transactions WHERE transaction_id = ?`,
            [transaction_id]).then(data => {
                return data
            })
    }

    updateTransactionHash(customer_id, transaction_hash, transaction_id) {
        if (customer_id || amount) {
            const update_balance_query = `UPDATE transactions SET transaction_hash = ? WHERE customer_id = ? and transaction_id = ?`;
            return this.bank_operations.run(
                update_balance_query, [transaction_hash, customer_id, transaction_id]
            );
        } else {
            return "Column missing"
        }
    }
}

module.exports = DBOperations;
