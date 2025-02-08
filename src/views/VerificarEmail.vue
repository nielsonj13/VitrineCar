<template>
  <div class="container verify-email-background">
    <div class="row verify-email-container">
      <!-- Área da imagem -->
      <div class="col-md-6 image-section"></div>

      <!-- Área de verificação -->
      <div class="col-md-6 verify-section">
        <img src="/public/logos/logo_vitrinecar.png" alt="VitrineCar" class="verify-logo">
        <h2>Verifique seu e-mail</h2>
        <p class="verify-text">
          Informe seu e-mail e senha para receber um novo link de verificação.
        </p>

        <form @submit.prevent="reenviarEmailVerificacao">
          <div class="mb-3">
            <label for="email">Email</label>
            <input 
              type="email" 
              v-model="email" 
              id="email" 
              class="form-control" 
              placeholder="user@exemplo.com" 
              required 
            />
          </div>

          <div class="mb-3">
            <label for="password">Senha</label>
            <input 
              type="password" 
              v-model="password" 
              id="password" 
              class="form-control" 
              placeholder="Digite sua senha" 
              required 
            />
          </div>

          <button type="submit" class="btn btn-primary" :disabled="enviando">
            {{ enviando ? "Enviando..." : "Reenviar Verificação" }}
          </button>

          <div class="text-center mt-3">
            <router-link to="/login">Voltar para Login</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";

export default {
  name: "VerificarEmail",
  data() {
    return {
      email: "",
      password: "",
      enviando: false,
    };
  },
  methods: {
    async reenviarEmailVerificacao() {
      try {
        this.enviando = true;
        const auth = getAuth();

        // Tenta autenticar o usuário para verificar se a conta existe
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        // Se o e-mail já estiver verificado, informa ao usuário
        if (user.emailVerified) {
          alert("Seu e-mail já está verificado. Você pode fazer login normalmente.");
          this.enviando = false;
          return;
        }

        // Se não estiver verificado, envia um novo link de verificação
        await sendEmailVerification(user);
        alert("Um novo e-mail de verificação foi enviado! Verifique sua caixa de entrada.");

        // Desloga o usuário imediatamente para evitar login antes da verificação
        await signOut(auth);
      } catch (error) {
        alert("Senha ou email inválidos, por favor tente novamente.");
        console.error(error);
      } finally {
        this.enviando = false;
      }
    },
    voltarParaLogin() {
      this.$router.push('/login');
    }
  },
};
</script>
  
  <style scoped>
  /* Fundo da tela */
  .verify-email-background {
    background-color: #f3f3f3;
    height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Card de verificação */
  .verify-email-container {
    width: 95vw;
    max-width: 1400px;
    height: 85vh;
    max-height: 700px;
    background: #fff;
    border-radius: 15px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
  }
  
  /* Área da imagem */
  .image-section {
    flex: 1;
    background: url('/logos/imagem_login.png') no-repeat center center;
    background-size: cover;
    display: none;
  }
  
  @media (min-width: 768px) {
    .image-section {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  /* Formulário de verificação */
  .verify-section {
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: white;
  }
  
  .verify-logo {
    display: block;
    max-width: 250px;
    margin: 0 auto 15px auto;
  }
  
  .verify-section h2 {
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
    color: #343a40;
  }
  
  .verify-text {
    text-align: center;
    margin-bottom: 20px;
    color: #6c757d;
  }
  
  .form-control {
    padding: 12px;
    font-size: 16px;
    width: 100%;
  }
  
  .btn-primary {
    background: #5B3199;
    border: none;
    transition: all 0.3s;
    width: 100%;
    padding: 10px;
  }
  
  .btn-primary:hover {
    background: #3a1e66;
  }
  
  /* Botão discreto para voltar */
  .voltar-btn {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: none;
    border: none;
    color: #6c757d;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
  }
  .text-center a {
    color: #5B3199;
    text-decoration: none;
    margin-top: 10px;
}
  </style>
  