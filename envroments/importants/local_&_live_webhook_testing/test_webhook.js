import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const lencoapikey = process.env.LENCOAPIKEY;

const payload = {
  event: "collection.successful",
  data: {
    reference: "1b42a54c-bc91-45e9-81a2-f95168375a49",
    amount: 250,
    currency: "ZMW",
  },
};

const payloadString = JSON.stringify(payload);
const webhookHashKey = crypto
  .createHash("sha256")
  .update(lencoapikey)
  .digest("hex");

const calculatedHash = crypto
  .createHmac("sha512", webhookHashKey)
  .update(payloadString)
  .digest("hex");

const testWebhook = async () => {
  // Example payload simulating a successful collection event

  try {
    const response = await fetch(
      "https://gettaways.alwaysdata.net/lenco/webkhook",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-lenco-signature": calculatedHash,
        },
        body: JSON.stringify(payload),
      },
    );

    console.log("Status:", response.status);

    // If 200 OK, body may be empty (because your server uses res.sendStatus(200))
    const text = await response.text();
    console.log("Response body:", text || "<empty>");
  } catch (err) {
    console.error("Error hitting webhook:", err);
  }
};

// Run the test
testWebhook();
