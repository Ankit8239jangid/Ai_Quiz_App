import express from "express";
import { Account } from "../DB/index.js";
import { verifyToken } from "../middleware/User.auth.js";
import { fromJSON } from "postcss";

const router = express.Router();

router.get("/balance", verifyToken, async (req, res) => {
    try {
        // console.log("User ID in account route:", req.userId); // Debug log
        // Use the correct field name that matches your schema
        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.json({
            balance: account.balance
        });

    } catch (error) {
        console.error("Error in balance route:", error); // Debug log
        return res.status(500).json({
            message: "Error fetching balance",
            error: error.message
        });
    }
});



// route to deposit money into account
router.put("/deposit", verifyToken, async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid deposit amount" });
        }

        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        account.balance += amount;
        await account.save();

        res.json({
            message: "Deposit successful",
            balance: account.balance
        });

    } catch (error) {
        console.error("Error in deposit route:", error); // Debug log
        return res.status(500).json({
            message: "Error depositing amount",
            error: error.message
        });
    }
});



// route to send  money from account to another account
router.put("/send", verifyToken, async (req, res) => {
    try {
        const { amount, to } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid send amount" });
        }

        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (account.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userId: to });

        if (!toAccount) {
            return res.status(404).json({ message: "Recipient account not found" });
        }

        account.balance -= amount;
        toAccount.balance += amount;

        await account.save();
        await toAccount.save();

        res.json({
            message: "Amount sent successfully",
            from: account.userId,
            balance: account.balance,
            massage: "Amount received successfully",
            to: toAccount.userId,
            toBalance: toAccount.balance

        });

    } catch (error) {
        console.error("Error in send route:", error); // Debug log
        return res.status(500).json({
            message: "Error sending amount",
            error: error.message
        });
    }
});


export default router;


