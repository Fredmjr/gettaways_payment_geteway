import { webhooks_logs } from "../logs/webhooks_logs/webhooks_logs.js";
import { webhook } from "../payment_models/lenco/webhook.js";

export const webkhookapiUrl = async (req, res) => {
  try {
    const result = await webhook(req);

    if (result.authorized === false) {
      return res.status(401).json({
        mgs: result.mgs,
      });
    }
    // Acknowledge receipt immediately with sendStatus to free up Lenco's connection
    res.sendStatus(200);

    if (result.authorized === true) {
      const event = result.event;
      console.log("Received event type", event); // proof checkering body contents

      // Safely extract the event data and process it asynchronously
      //my comment below needs to be double checked
      // Look for the specific event when a transaction collection succeeds
      // This reference (lenco_client_reference) will match the uuidv4 reference you originally generated during checkout
      if (event.event === "collection.successful") {
        const transaction_data = event.data;
        console.log(`Received transaction data from body: ${transaction_data}`);
        const lenco_client_reference = transaction_data.reference;
        const amount_paid = transaction_data.amount;

        console.log(
          `Payment confirmed! Reference: ${lenco_client_reference} paid ${amount_paid} ZMW`,
        );

        // Task #1: Update payment_sttus:Pending to payment_sttus:Paid in db by use of find by the uuid generate in the initializer.
        // Task #2: Deliver payment
        //test function
        webhooks_logs(transaction_data);
      }
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).json({
        erMgs: "Unable to process request!",
      });
    }
  }
};

export const testUrl = async (req, res) => {
  const a = req.body;

  try {
    if (a) {
      return res.status(200).json({
        mgs: "success",
      });
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).json({
        erMgs: "Unable to process request!",
      });
    }
  }
};
