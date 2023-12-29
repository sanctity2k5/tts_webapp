const express = require("express");
const License = require("../model/licenseModel");
const axios = require("axios");
const catchAsync = require("../utils/catchAsync");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

dotenv.config({ path: "../../config.env" });

exports.createLicenseKey = catchAsync(async (req, res) => {
  const response = await axios.post(
    "https://api.gumroad.com/v2/licenses/verify",
    {
      product_id: `${process.env.PRODUCT_ID}`,
      license_key: req.body.licenseKey,
      increment_uses_count: true,
    }
  );

  // console.log("response===========>", response.data.success);

  if (response.data.success) {
    const newLicenseKey = await License.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        licenseKey: newLicenseKey,
      },
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "License verification failed",
    });
  }
});

//   Middleware for protecting the route

exports.protectRoute = catchAsync(async (req, res, next) => {
  try {
    const clientLicense = req.params.id;

    const license = await License.findOne({ licenseKey: clientLicense });
    console.log(clientLicense);
    // console.log("license===========>", license);

    if (license && license.expired === false) {
      // License is valid and not expired
      next();
    } else {
      // License is either not found, expired, or invalid
      res.redirect("/index.html");
    }
  } catch (error) {
    // Handle any errors that occurred during the license lookup
    console.error("Error checking license:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

exports.updateLicense = catchAsync(async (req, res) => {
  try {
    const licenseKey = req.body.licenseKey;
    //   console.log(licenseKey)

    // Find the license in the database and update the 'expired' property
    const license = await License.findOneAndUpdate(
      { licenseKey: licenseKey },
      { expired: true }
    );
    //   console.log(license)

    if (!license) {
      // console.log(license)
      return res.status(404).json({ message: "License not found" });
    }

    res.status(200).json({ message: "License updated successfully" });
  } catch (error) {
    console.error("Error updating license:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
