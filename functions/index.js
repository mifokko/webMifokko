const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const cors = require("cors")({origin: true});
const firestore = admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.enPoint = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(500).json({
        message: "No permitido",
      });
    }
    const event = (req.body.data);
    const model = event.transaction.status;
    const name = event.transaction.customer_data.full_name;
    const fechaT = event.transaction.finalized_at;
    const id = event.transaction.id;
    const respuestaRef = firestore.collection("Pagos").doc(id).create({
      status: model,
      nombre: name,
      referencia: event.transaction.reference,
      fecha: fechaT,
      id: id,
    });
    res.status(200).json({
      model,
      name,
      fechaT,
      id,
      respuestaRef,
      message: "Esta trabajando!",
    });
  });
});
