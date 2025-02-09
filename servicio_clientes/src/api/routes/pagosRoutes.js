const express = require("express");
const { createCheckoutSession } = require("../views/PagosController");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");

const router = express.Router();

router.post("/pagos/checkout-session", verifyToken, createCheckoutSession);

module.exports = router;
