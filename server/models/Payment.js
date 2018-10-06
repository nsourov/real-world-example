const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CreditSchema = new Schema({
  paid: Number,
  currency: {
    type: String,
    default: "usd"
  },
  credit: Number,
  email: String,
  date: {
    type: Date,
    default: Date.now
  }
});
mongoose.model("Credit", CreditSchema);