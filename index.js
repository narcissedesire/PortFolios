import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://portfolio-narcisse.pages.dev",
  })
);
app.use(bodyParser.json());

// Vérifiez que la clé API est correctement chargée
console.log("API_KEY:", process.env.API_KEY);
console.log("FROM_EMAIL:", process.env.FROM_EMAIL);
console.log("TO_EMAIL:", process.env.TO_EMAIL);

sgMail.setApiKey(process.env.API_KEY);

app.post("/api/send", async (req, res) => {
  const { email, sujet, message } = req.body;

  // Vérifiez les données reçues
  console.log("Données reçues :", req.body);

  const msg = {
    to: process.env.TO_EMAIL,
    from: process.env.FROM_EMAIL,
    subject: sujet,
    text: message,
    html: `<p><strong>Source : </strong>${email} <br/></p>
           <p><strong>${sujet}</strong></p>
           <p>${message.replace(/\n/g, "<br />")}</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log("E-mail envoyé avec succès");
    res.status(200).json({ status: 200, message: "E-mail envoyé !" });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
    res
      .status(500)
      .json({ status: 500, message: "Erreur lors de l'envoi de l'e-mail" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
