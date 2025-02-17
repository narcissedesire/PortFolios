import { Router } from "itty-router";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

// Initialise le routeur
const router = Router();

// Configurer l'API de SendGrid
sgMail.setApiKey(process.env.API_KEY);

// Définir la route pour envoyer l'email
router.post("/api/send", async (req) => {
  const { email, sujet, message } = await req.json();

  const msg = {
    to: process.env.TO_EMAIL,
    from: process.env.FROM_EMAIL,
    subject: sujet,
    text: message,
    html: `<p><strong>Source: </strong>${email} <br/></p>
           <p><strong>${sujet}</strong></p>
           <p>${message.replace(/\n/g, "<br />")}</p>`,
  };

  try {
    await sgMail.send(msg);
    return new Response(
      JSON.stringify({ status: 200, message: "E-mail envoyé !" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
    return new Response(
      JSON.stringify({
        status: 500,
        message: "Erreur lors de l'envoi de l'e-mail",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

// Gérer la requête entrante et répondre avec le router
addEventListener("fetch", (event) => {
  event.respondWith(router.handle(event.request));
});
