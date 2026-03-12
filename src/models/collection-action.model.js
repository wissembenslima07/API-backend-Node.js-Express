const mongoose = require("mongoose");

const COLLECTION_ACTION_TYPES = ["call", "email", "visit", "notice"];

const collectionActionSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: false,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: COLLECTION_ACTION_TYPES,
      required: true,
    },
    actionDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    result: {
      type: String,
      trim: true,
      default: "",
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  CollectionAction: mongoose.model("CollectionAction", collectionActionSchema),
  COLLECTION_ACTION_TYPES,
};
