import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../config/firebase";

const functions = getFunctions(app, 'southamerica-east1'); // Especifique sua região

// Função para chamar a Cloud Function que cria a sessão de checkout
export const createStripeCheckoutSession = httpsCallable(functions, 'createCheckoutSession');