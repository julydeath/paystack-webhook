require("dotenv").config();
const express = require("express");
const app = express();
const crypto = require("crypto");
const secret = process.env.SECRET_KEY;
const bodyParser = require("body-parser");

const port = 3001;

app.get("/", (req, res) => {
  res.send(200);
});

// Paystack Webhook function starts here

app.post("/webhook", function (req, res) {
  //validate event
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash == req.headers["x-paystack-signature"]) {
    // Retrieve the request's body
    const event = req.body;
    // Do something with event
    if (event && event.event === "transfer.success") {
      return res.status(200).json({ message: "Transfer successful" });
    }
  }

  res.send(200);
});

// Paystack Webhook function ends here

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
