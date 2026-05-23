import dotenv from "dotenv";

dotenv.config();

const lencoapikey = process.env.LENCOAPIKEY;
const client_reference = "168375ac-bc91-45e9-81a2-f95149b42a54";

export const double_checker = async (client_ref) => {
  try {
    const response = await fetch(
      `https://api.lenco.co/access/v2/collections/status/${client_ref}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${lencoapikey}`,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`); //if it fails jump striaght catch block code

    const result = await response.json();
    console.log("thissssssssssssssssssss", result);

    if (result.success && result.data) {
      return {
        status: result.data.status,
        reason: result.data.reasonForFailure,
      };
    }
  } catch (error) {
    console.error(
      "chkr_process_sttus: failed",
      "erMgs: Error executing status re-query look up:",
      error,
    );
  }
};

const run = async () => {
  const result = await double_checker(client_reference);
  console.log("resulttttttttttttttt", result);
  if (!result) {
    console.log(
      "chkr_process_sttus: erMgs",
      "erMgs: Failed to check transaction status.",
    );
    return;
  }

  switch (result.status) {
    case "successful":
      console.log("chkr_process_sttus: sucess", "message: Payment completed.");
      // TODO: Run database update logic to complete the order safely
      break;

    case "pay-offline":
      console.log(
        "chkr_process_sttus: pending",
        "message: Enter mobile PIN on your mobile.",
      );
      break;

    case "failed":
      console.log(
        "chkr_process_sttus: failed",
        `message: ${result || "Unknown"}`,
      );
      break;

    default:
      console.log(
        "chkr_process_sttus: default",
        `erMgs: : Unable to check transaction status: ${result}`,
      );
  }
};
run();
