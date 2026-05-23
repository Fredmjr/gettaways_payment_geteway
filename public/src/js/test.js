const testWebhook = async () => {
  // Example payload simulating a successful collection event
  const payload = {
    event: "collection.successful",
    data: {
      reference: "uuidv4-generated-ref",
      amount: 250,
      currency: "ZMW",
    },
  };

  // For testing, hardcode a fake signature string
  // In real use, Lenco generates this header and sends it
  const fakeSignature = "test_signature_string";

  try {
    const response = await fetch("/lenco/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-lenco-signature": fakeSignature,
      },
      body: JSON.stringify(payload),
    });

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
