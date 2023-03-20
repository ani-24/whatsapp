const express = require("express");
const app = express();

const qrcode = require("qrcode-terminal");

const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),
});

const time = new Date("20 March, 2023 09:43:00").getTime();
let gap = time;

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("Client is ready!");
  const contacts = await client.getChats();
  contacts.forEach((el) => {
    if (el.name.toLowerCase().includes("pops")) {
      const sendMsg = setInterval(() => {
        const current = new Date().getTime();
        gap = time - current;
        console.log(gap);
        if (gap <= 0) {
          console.log(gap);
          client.sendMessage(el.id._serialized, "Test message");
          clearInterval(sendMsg);
        }
      }, 1000);
    }
  });
});

client.initialize();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello, world");
});

app.listen(port, () => {
  console.log(`Server up and running`);
});
