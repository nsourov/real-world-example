const express = require("express");
const router = express.Router();
const auth = require("../auth");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Credit = mongoose.model("Credit");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

require("dotenv").config();

// @route   POST api/credit/buy
// @desc    Buy Credits
// @access  Private
router.post("/buy", auth.required, async (req, res) => {
  try {
    const { credit, email } = req.body;
    const user = await User.findById(req.user._id);
    if (credit < 50) {
      return res
        .status(400)
        .json({ message: "You have to buy minimum 50 credit" });
    }
    /**
     * TODO: Need to make that dynamic. For now it's static 0.01 dollar per credit.
     * Need to integrate with frontend form
     */
    const amount = credit * 0.01 * 100;
    const customer = await stripe.customers.create({
      email,
      source: "tok_visa" // need to add token comes from frontend
    });
    const pay = await stripe.charges.create({
      amount,
      description: "Buy credit",
      currency: "usd",
      customer: customer.id
    });
    const addHistory = new Credit({
      paid: amount / 100,
      credit: credit,
      email
    });
    user.credit = user.credit + Number(credit);
    await user.save();
    await addHistory.save();
    return res.status(200).json({ message: pay.outcome.seller_message });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

module.exports = router;
