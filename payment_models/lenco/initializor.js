import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const lencoapikey = process.env.LENCOAPIKEY;
let temp_reference;

export const initializor = async (srvr_data) => {
  try {
    const response = await fetch(
      "https://api.lenco.co/access/v2/collections/mobile-money",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${lencoapikey}`,
        },
        body: JSON.stringify(srvr_data),
      },
    );

    const data = await response.json();
    temp_reference = srvr_data.reference;
    return {
      data,
      temp_reference,
    };
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
