// Importa as instâncias já inicializadas do nosso arquivo de configuração
import { auth, db } from "./firebase.ts";
// Importa as funções que precisamos
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// --- Definição dos Usuários de Teste ---
const usersToCreate = [
  {
    email: "devair.junior@sou.unifal-mg.edu.br",
    password: "12345678",
    role: "patient",
  },
  {
    email: "contatodevairjunior@gmail.com",
    password: "12345678",
    role: "admin",
  },
];

// --- Função Principal do Script ---
async function seedDatabase() {
  console.log("Iniciando o povoamento do banco de dados...");

  for (const userData of usersToCreate) {
    try {
      console.log(`Criando usuário de autenticação para: ${userData.email}`);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const uid = userCredential.user.uid;
      console.log(`-> Usuário de autenticação criado com UID: ${uid}`);

      console.log(`Criando documento de perfil para UID: ${uid} com role: ${userData.role}`);
      const userDocRef = doc(db, "users", uid);

      if (userData.role === 'admin') {
        await setDoc(userDocRef, { role: 'admin', status: 'approved' });
      } else if (userData.role === 'patient') {
        const patientDocRef = doc(db, "patients", uid);
        await setDoc(userDocRef, { role: 'patient' });
        await setDoc(patientDocRef, {
            name: "Devair Junior (Paciente Teste)",
            email: userData.email,
            psychologistId: "ID_DE_UM_PSICOLOGO_APROVADO", // IMPORTANTE: Troque por um UID de psicólogo válido e aprovado
            hasCompletedQuestionnaire: false,
            role: 'patient',
        });
      }
      
      console.log(`-> Perfil para ${userData.email} criado com sucesso!`);

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`Usuário ${userData.email} já existe. Pulando.`);
      } else {
        console.error(`Erro ao criar usuário ${userData.email}:`, error.message);
      }
    }
  }

  console.log("\nPovoamento do banco de dados concluído!");
  process.exit(0);
}

// Executa a função
seedDatabase();