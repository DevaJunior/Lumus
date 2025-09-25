import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type Auth, type UserCredential, } from "firebase/auth"; import { auth } from "../config/firebase";

class AuthService {
  private auth: Auth;

  constructor(authInstance: Auth) {
    this.auth = authInstance;
  }

  // Função de Login
  async login(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential;
    } catch (error) {
      console.error("Erro no login: ", error);
      throw error; // Propaga o erro para ser tratado na UI
    }
  }

  // Função de Logout
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error("Erro no logout: ", error);
      throw error;
    }
  }

  // NOVA FUNÇÃO DE REGISTRO
  async register(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      // Após o registro, o Firebase automaticamente loga o usuário.
      return userCredential;
    } catch (error) {
      console.error("Erro no registro: ", error);
      throw error;
    }
  }
}

// Exporta uma instância da classe, pronta para ser usada
export const authService = new AuthService(auth);