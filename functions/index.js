const functions = require("firebase-functions");
const mercadopagoCtrl = require("mercadopago")
exports.checkout = functions.https.onCall((preference, context) => {
  return mercadopagoCtrl.makecheckout(preference).then((response) => {
    // Este es el checkout generado o link al que nos vamos a posicionar para pagar
    console.log(response.body.init_point);
    const init_point = response.body.init_point;
    return {result: init_point};
  }).catch((error) => {
    console.log(error);
    return error;
  });
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
