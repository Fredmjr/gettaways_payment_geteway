import dotenv from "dotenv";

dotenv.config();

const lencoapikey = process.env.LENCOAPIKEY;

export const balance = async () => {
  try {
    const response = await fetch("https://api.lenco.co/access/v2/accounts", {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${lencoapikey}`,
      },
    });

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

balance();
