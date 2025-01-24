<template>
  <div class="container">
    <!-- Seção da imagem -->
    <div class="image-section"></div>

    <!-- Seção do formulário -->
    <div class="form-section">
      <img class="logo" src="/public/logos/logo_vitrinecar.png" alt="VitrineCar">
      <h2 class="form-title">Esqueceu a senha?</h2>
      <p class="instructions">
        Informe seu email cadastrado para receber instruções de redefinição de senha
      </p>
      <form @submit.prevent="recuperarSenha">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="user@exemplo.com" 
            required
          />
        </div>
        <button type="submit" class="submit-button" :disabled="loading">
          {{ loading ? "Enviando..." : "Enviar" }}
        </button>
      </form>
      <div class="form-footer">
        <p>Retornar para <router-link to="/">Login</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default {
  name: "EsqueceuSenha",
  data() {
    return {
      email: "",
      loading: false,
    };
  },
  methods: {
    async recuperarSenha() {
      if (!this.email) {
        alert("Por favor, insira seu email!");
        return;
      }
      this.loading = true;
      const auth = getAuth();
      try {
        await sendPasswordResetEmail(auth, this.email);
        alert(`Instruções enviadas para o email: ${this.email}`);
        this.email = "";
        this.$router.push("/login");
      } catch (error) {
        alert("Erro ao enviar email de recuperação: " + error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Estilo do body e fundo geral */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F3F3F3;
  overflow: hidden;
}

/* Container principal */
.container {
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: #FFF;
}

/* Estilo da imagem e fundo do carro */
.image-section {
  background-image: url('/public/logos/imagem_login.png');
  background-size: cover;
  background-position: center;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

/* Seção do formulário */
.form-section {
  padding: 40px;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo {
  width: 250px;
  height: auto;
  margin: 0 auto 10px;
  display: block;
}

.form-title {
  color: #531B76;
  margin: 5px 0 20px;
  font-size: 28px;
  text-align: center;
}

.instructions {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.form-group input {
  padding: 10px;
  border: 1px solid #CCC;
  border-radius: 5px;
  font-size: 16px;
}

.submit-button {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #531B76;
  color: #FFF;
  margin-bottom: 10px;
}

.submit-button:disabled {
  background-color: #888;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  font-size: 14px;
  margin-top: 15px;
}

.form-footer a {
  color: #5B3199;
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}
</style>
