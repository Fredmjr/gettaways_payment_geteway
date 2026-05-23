Repo contains Payment system.

INTERGRATIONS INCLUDES;

1. lenco BroadPay
   1.1 Mobile payment (Airtel/ MTN)

SETUP
Main - main configs for payment interatcions, record & completion.

1. initializor (payment_models\lenco\initializor.js)
   - Initiates the payment and recreates new payment record with valid payment details.
2. double_checker (payment_models\lenco\double_checker.js)
   - Checks payment status on lenco side using lenoc's reference (is always sent at step 1 (initializor) in json data form)
   - reference is kept in db as "lenco_payment_reference"
   - use reference (lenco_payment_reference) to check payment status on lenco side, e.g if payment failed, json data show payment details including reason of failure, e.g reasonForFailure: 'User did not enter PIN or Payment invalid', and status: 'failed'.
   - double_checker must be done or configured manually, function location (payment_models\lenco\double_checker.js), reference being given as parameter on url. e.g "https://api.lenco.co/access/v2/collections/status/${client_ref}"
   - client_ref is reference (any variable name as long as reference is used).

3. webhook (payment_models\lenco\webhook.js)
   - listens for lenco's payment status approval, once lenco approves, app/site server endpoint chnages payment status to "Paid".

Sub - in app/site configs

1. client double checker.
   - Checks payment status in db if "Pending" or "Paid".
   - Has three checkers; normal, 10 secs and 20 secs checkers.

STRUCTURE
initializor.js
double_checker.js
webhook.js

PAYMENT PROCESS
[Your App/site] --(1. Initiates MoMo Request (records new entry & keeps checking status "paid/pending"))--> [Lenco API]
|
(2. Sends Push to Customer Phone (enter PIN))
|
[Customer inputs PIN]
|
[Your App/site Endpoint] <--(4. Webhook Event)<-- [Lenco Server]
|
(5. Confirms & updates DB)
