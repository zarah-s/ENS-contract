const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config();
const ABI = require("./chatAbi.json")
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("common"));



async function sendMessage(data) {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

        const encryptedJsonKey = fs.readFileSync("./.encryptedKey.json", "utf8");
        let wallet = ethers.Wallet.fromEncryptedJsonSync(encryptedJsonKey, process.env.PRIVATE_KEY_PASSWORD);
        wallet = wallet.connect(provider)

        const contract = new ethers.Contract(process.env.VITE_CHAT_ADDRESS,
            ABI,
            wallet);

        const tx = await contract.sendMessage(data.from, data.to, data.message);
        const receipt = await tx.wait();
        if (receipt.status) {

            return { success: true, tx, message: "Message sent" }
        } else {
            return { success: false, tx, message: "Message send failed" }
        }
    } catch (error) {
        console.error(error);
        return {
            success: false, tx: {}, message: error?.reason ?? "ERROR_OCCURED"
        }

    }
}

function verifyMessageWithEthers(message, signature) {
    const signerAddress = ethers.verifyMessage(message, signature);
    return signerAddress;
}

app.post("/send-message", async (req, res) => {
    const data = req.body;
    const signerAddress = verifyMessageWithEthers(JSON.stringify({
        from: data.from,
        to: data.to,
        message: data.message,

    }), data.signature);
    if (signerAddress.toString() === data.from.toString()) {
        const tx = await sendMessage(data);
        if (tx.success) {

            res.status(200).send(tx)
        } else {
            res.status(500).send(tx)

        }
    } else {
        res.status(400).send({ success: false, message: "Invalid signature" })
    }
})

const server = app;
const PORT = 5000 || process.env.PORT
server.listen(5000, async () => {
    console.log("server running on port ", PORT);

});

