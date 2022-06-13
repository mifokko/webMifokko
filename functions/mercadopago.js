const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: "TEST-64d069c3-f91e-4dbd-8410-9f9efc9920c1",
});

const mercadopagoCtrl = {};

mercadopagoCtrl.makecheckout = (preferences, res) => {
  console.log(preferences);
  return mercadopago.preferences.create(preferences);
};

module.exports = mercadopagoCtrl;
