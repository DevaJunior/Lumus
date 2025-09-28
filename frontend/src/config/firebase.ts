// Importa as funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// A configuração do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCxrLu7xy8ERyj0CJR5vGsdMea8txL1UAY",
  authDomain: "lumus-17576.firebaseapp.com",
  projectId: "lumus-17576",
  storageBucket: "lumus-17576.appspot.com", // Corrigido para o domínio correto do storage
  messagingSenderId: "291427971991",
  appId: "1:291427971991:web:075712ef1d2e6e753f8ad2"
};

// Inicializa o Firebase
// ADICIONADO "export" AQUI
export const app = initializeApp(firebaseConfig);

// Exporta as instâncias dos serviços que usaremos na aplicação
export const auth = getAuth(app);
export const db = getFirestore(app);