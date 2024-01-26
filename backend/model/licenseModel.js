/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require("mongoose");
// const validator = require('validator');

const licenseSchema = new mongoose.Schema({
  licenseKey: {
    type: String,
    required: [true, "Please input your license key"],
  },
  expired: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const License = mongoose.model("License", licenseSchema);

module.exports = License;
