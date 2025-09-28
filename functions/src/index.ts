import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

admin.initializeApp();
const db = admin.firestore();

// Inicializa o Stripe com a chave secreta configurada
const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: "2024-04-10",
});

/**
 * Cria uma sessão de checkout do Stripe para um plano de assinatura.
 */
export const createCheckoutSession = functions.https.onCall(
  async (data, context) => {
    // Garante que o usuário esteja autenticado
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Você precisa estar logado para fazer uma assinatura."
      );
    }

    const { plan, priceId } = data; // 'basic' ou 'premium' e o ID do preço no Stripe
    const userId = context.auth.uid;
    const userEmail = context.auth.token.email || "";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "http://localhost:5173/pagamento-sucesso", // URL de sucesso
      cancel_url: "http://localhost:5173/assinatura", // URL de cancelamento
      customer_email: userEmail,
      client_reference_id: userId, // Linka a sessão ao nosso UID de usuário
      metadata: {
        userId: userId,
        plan: plan,
      },
    });

    return { id: session.id };
  }
);

/**
 * Webhook que escuta por eventos do Stripe para confirmar o pagamento
 * e atualizar o perfil do usuário no Firestore.
 */
export const stripeWebhook = functions.https.onRequest(
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    // O endpoint secret é obtido ao criar o webhook no painel do Stripe
    const endpointSecret = functions.config().stripe.webhook_secret;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed.", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Lida com o evento de checkout bem-sucedido
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, plan } = session.metadata as { userId: string, plan: 'basic' | 'premium' };

      // Atualiza o perfil do usuário no Firestore para ativar a assinatura
      const userDocRef = db.collection("users").doc(userId);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      await userDocRef.update({
        subscriptionPlan: plan,
        subscriptionStatus: "active",
        subscriptionEndDate: admin.firestore.Timestamp.fromDate(endDate),
      });

      console.log(`Assinatura para o usuário ${userId} foi ativada com sucesso.`);
    }

    res.status(200).send();
  }
);