err_code_001: ?
err_code_002: ?

err_code_003: Pymnt_lnco_id & Pymnt_usr_id
-Definitions_case: Unable to find usr_payment_id & lenco_payment_id in database
-Usage_case: Used for checking specific payment status (Pending or Paid)

err_code_004: UND_ERR_CONNECT_TIMEOUT" or err.code === "ETIMEDOUT" or err.name === "TimeoutError"
-Definitions_case: connecion to service provider was unreachable or timed out
-Usage_case: Checking if connection to service provider was unreachable or timed out
