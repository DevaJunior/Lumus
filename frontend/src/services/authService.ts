import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, type Auth, type UserCredential, } from "firebase/auth"; import { auth } from "../config/firebase";
import { userService } from "./userService";

class AuthService {
  private auth: Auth;

  constructor(authInstance: Auth) {
    this.auth = authInstance;
  }

  async login(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential;
    } catch (error) {
      console.error("Erro no login: ", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error("Erro no logout: ", error);
      throw error;
    }
  }

  async register(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      // ATUALIZADO para passar o e-mail para a função de criação de perfil
      await userService.createPsychologistProfile(userCredential.user.uid, email);
      return userCredential;
    } catch (error) {
      console.error("Erro no registro: ", error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error("Erro ao enviar e-mail de redefinição de senha: ", error);
      throw error;
    }
  }
}

export const authService = new AuthService(auth);