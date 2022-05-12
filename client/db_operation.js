class DBOperations {
    constructor(BankTransaction) {
        this.bank_operations = BankTransaction
    }

    createTables() {
        const customer_table_sql = `
        CREATE TABLE IF NOT EXISTS "customers"(customer_id text primary key not null, customer_name text not null, public_key text not null, bank_name text not null, balance int)`
        this.bank_operations.run(customer_table_sql)
        const transaction_table_sql = `
        CREATE TABLE IF NOT EXISTS transactions (transaction_id text NULL, customer_id TEXT NOT NULL, transaction_name TEXT NOT NULL, amount int null, transaction_hash text  null, dest_account text null, created_at text not null, customer_name text not null, dest_customer_name text null)`
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
        const dest_account = data['dest_account'];
        const amount = data['amount'];
        const transaction_id = data['transaction_id'];
        const created_at = data['created_at']
        const customer_name = data['customer_name']
        const dest_customer_name = data['dest_customer_name']
        if (customer_id && transaction_name) {
            const insert_transaction_query = `insert into transactions (transaction_id, customer_id, transaction_name, amount, transaction_hash, created_at, customer_name, dest_customer_name, dest_account) VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?)`;
            return this.bank_operations.run(
                insert_transaction_query,[
                    transaction_id,
                    customer_id,
                    transaction_name,
                    amount,
                    transaction_hash,
                    created_at,
                    customer_name,
                    dest_customer_name,
                    dest_account
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
                update_balance_query, [amount, customer_id]
            );
        } else {
            return "Column missing"
        }
    }

    getAllUserTransaction(id) {
        return this.bank_operations.all(
            `SELECT * FROM transactions WHERE customer_id = ? or dest_account = ?`,
            [id, id]).then(data => {
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

    getAllUser() {
        return this.bank_operations.all(
            `SELECT * FROM customers`,
            ).then(data => {
                return data
            })
    }


    getUserLastTransaction(customer_id) {
        return this.bank_operations.all(
            `SELECT transaction_id FROM transactions WHERE customer_id = ? and transaction_id is not null order by transaction_id desc limit 1`,
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

    updateTransactionHash(data) {
        const customer_id = data['customer_id'];
        const transaction_hash = data['transaction_hash'];
        const last_transaction_name = data['last_transaction_name'];
        const last_amount = data['last_amount'];
        console.log({
            "customer_id": customer_id,
            "transaction_hash": transaction_hash,
        })
        if (customer_id) {
            const update_hash_query = `UPDATE transactions SET transaction_hash = ? WHERE customer_id = ? and transaction_name = ? and amount = ?`;
            return this.bank_operations.run(
                update_hash_query, [transaction_hash, customer_id, last_transaction_name, last_amount]
            ).then(update_hash_res => {
                console.log("update_hash_res", update_hash_res)
                const remove_dup_query = `delete from transactions where rowid not in (select min(rowid) from transactions group by transaction_hash);`;
                return this.bank_operations.run(remove_dup_query)
            });
        } else {
            return "Column missing"
        }
    }
}

module.exports = DBOperations;
