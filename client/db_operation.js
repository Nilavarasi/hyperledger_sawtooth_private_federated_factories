class DBOperations {
    constructor(BankTransaction) {
        this.bank_operations = BankTransaction
    }

    createTables() {
        const customer_table_sql = `
        CREATE TABLE IF NOT EXISTS "customers"(customer_id text primary key not null, customer_name text not null, public_key text not null, bank_name text not null, balance int)`
        this.bank_operations.run(customer_table_sql)
        const transaction_table_sql = `
        CREATE TABLE transactions (transaction_id text primary key NOT NULL, customer_id TEXT NOT NULL, transaction_name TEXT NOT NULL, amount int null, transaction_hash text not null, dest_account text not null)`
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
        const dest_account = data['dest_account']
        if (customer_id && transaction_name && transaction_hash) {
            const insert_transaction_query = `insert into transactions (transaction_id, customer_id, transaction_name, amount, transaction_hash, dest_account) VALUES (?, ?, ?, ? , ?, ?)`;
            return this.bank_operations.run(
                insert_transaction_query,[
                    transaction_hash, customer_id, transaction_name, amount, transaction_hash, dest_account
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