<template>
  <div class="container">
    <!-- Área da imagem e logo -->
    <div class="image-section"></div>

    <!-- Área de login -->
    <div class="login-section">
      <h2 class="welcome-text">
        Bem-vindo a<br />
        <span class="highlight">VitrineCar</span>
      </h2>

      <form @submit.prevent="login">
        <label for="email">Email</label>
        <input 
          type="email" 
          v-model="email" 
          id="email" 
          placeholder="user@exemplo.com" 
          required 
        />

        <label for="password">Senha</label>
        <input 
          type="password" 
          v-model="password" 
          id="password" 
          placeholder="senha" 
          required 
        />

        <button type="submit">Entrar</button>

        <div>
          <router-link to="/esqueceu-senha">Esqueceu a senha?</router-link>
          <router-link to="/cadastro">Cadastre-se</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push('/');
      } catch (error) {
        alert("Erro ao fazer login: " + error.message);
        console.error("Erro de login:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Estilos gerais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F3F3F3;
}

/* Container principal ocupando a tela inteira */
.container {
  display: flex;
  width: 80%;
  height: 100vh;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Área de imagem e logo */
.image-section {
  background: url('/logos/imagem_login.png') no-repeat center center;
  background-size: cover;
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 20px;
}

/* Área de login */
.login-section {
  width: 40%;
  height: 100%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
}

/* Texto de Bem-vindo */
.welcome-text {
  font-size: 32px;
  color: #531B76;
  text-align: center;
  margin-bottom: 30px;
  line-height: 1.5;
}

.welcome-text .highlight {
  color: #5B3199;
}

.login-section label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  display: block;
}

.login-section input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #CCC;
  border-radius: 5px;
  margin-bottom: 20px;
  background-color: #F3F3F3;
}

.login-section button {
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

.login-section a {
  font-size: 14px;
  color: #531B76;
  text-decoration: none;
  display: inline-block;
  margin-top: 10px;
}

.login-section a:hover {
  text-decoration: underline;
}
</style>
