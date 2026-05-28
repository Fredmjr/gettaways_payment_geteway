import dotenv from "dotenv";

dotenv.config();

const lencoapikey = process.env.LENCOAPIKEY;
const lencoAccount1 = process.env.LENCO_ACCOUNT_1; // get from where it list all accounts choose one,
// run this js file to get account: "payment_models\lenco\balance.js"

export const individual_balance = async () => {
  try {
    const response = await fetch(
      `https://api.lenco.co/access/v2/accounts/${lencoAccount1}/balance`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${lencoapikey}`,
        },
      },
    );

    const data = await response.json();
    console.log(data);
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

    //general errs
    return {
      general_timeout_sttus: true,
    };
  }
};

individual_balance();
