import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const lencoapikey = process.env.LENCOAPIKEY;

// 2. This is the unauthenticated POST endpoint you give to Lenco support
export const webhook = async (req) => {
  try {
    // 1. Pre-calculate the webhook hash key as required by Lenco docs
    const webhookHashKey = crypto
      .createHash("sha256")
      .update(lencoapikey)
      .digest("hex");

    // 3. Verify the signature to protect against hackers sending fake payments
    const lencoSignature =
      req.headers["x-lenco-signature"] || req.headers["X-Lenco-Signature"];
    if (!lencoSignature) {
      return {
        authorized: false,
        mgs: "Missing x-lenco-signature header verification metadata.",
      };
    }

    //4. Use raw bytes instead of stringified objects to prevent hash mismatch
    const payload = req.rawBody
      ? req.rawBody.toString("utf8")
      : JSON.stringify(req.body);

    const calculatedHash = crypto
      .createHmac("sha512", webhookHashKey)
      .update(payload)
      .digest("hex");

    if (calculatedHash !== lencoSignature) {
      return {
        authorized: false,
        mgs: "Unauthorized webhook attempt detected.",
      };
    }

    // 4. Acknowledge receipt immediately to prevent Lenco from timing out
    // Lenco docs state: "respond immediately with a 200 before it goes on to perform the rest of the task"
    return {
      authorized: true,
      event: req.body,
    };
  } catch (error) {
    return {
      authorized: false,
      mgs: error.message || "Signature computation failed.",
    };
  }
};
