import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const lencoapikey = process.env.LENCOAPIKEY;
const lencoAccount1 = process.env.LENCO_ACCOUNT_1; // get from where it list all accounts choose one,
// run this js file to get account: "payment_models\lenco\balance.js"
const bankAccountnumber = process.env.BANK_ACCOUNT_NUMBER; //your actual bank account number
const bankId = process.env.BANK_ID; // run this file to get all lenco support banks ad their ids, select id and use here (tested was for fnb): "payment_models\lenco\features\all_banks.js"
//transfers only Malawi and Zambia
const payload = {
  accountId: lencoAccount1,
  amount: "0.01",
  reference: uuidv4(),
  accountNumber: bankAccountnumber,
  bankId: bankId,
  country: "zm",
  narration: "Bank payout",
};
export const withdraw_or_transfer = async (payload) => {
  try {
    const response = await fetch(
      "https://api.lenco.co/access/v2/transfers/bank-account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${lencoapikey}`,
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();
    console.log(data); //'You can not send less than k5' err bessides that we good to transact
  } catch (err) {
    console.error("lenco_API Error:", err);
    //timeouts errs
    const is_timeout =
      err.code === "ETIMEDOUT" ||
      err.name === "TimeoutError" ||
      err.cause?.code === "UND_ERR_CONNECT_TIMEOUT" ||
      err.cause?.code === "ETIMEDOUT" ||
      err.cause?.name === "ConnectTimeoutError" ||
      err.cause?.name === "AggregateError";

    if (is_timeout) {
      return {
        timeout_sttus: true,
      };
    }

    //general errs initializer
    return {
      general_timeout_sttus: true,
    };
  }
};

withdraw_or_transfer(payload);
