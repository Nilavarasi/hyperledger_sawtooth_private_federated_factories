# STEPS TO RUN THE PROJECT

  sudo docker system prune -af [OPTIONAL]

1. start the validator
	sudo docker compose -f sawtooth-default.yaml up

2. Run Processor
    1. nvm install 12 [Current version (node 16) won't be supported by sawtooth sdk]
    2. nvm use 12
    3. node index.js


3. Run client

    1. Create Account 
		node app.js 'Nila' '{"verb":"create_account","customer_id":"101","customer_name":"Nila","savings_balance":5000,"checking_balance":3000}'


    2. To deposit money from account
		node app.js 'Nila' '{"verb":"deposit_money","customer_id":"101","amount":2000}'


    3.  To Transfer money from account
		
		node app.js 'Nila' '{"verb":"transfer_money","source_customer_id":"101","dest_customer_id":"102", "amount":1000}'

    4. To Withdraw money from account
		
		node app.js 'Nila' '{"verb":"withdraw_money","customer_id":"101","amount":4000}'

