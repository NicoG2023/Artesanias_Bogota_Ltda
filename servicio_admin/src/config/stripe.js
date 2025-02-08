// config/stripe.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.SECRET_KEY_STRIPE); // o tu clave secreta

module.exports = stripe;
