<template>
  <div class="container">
    <!-- Área da imagem e logo -->
    <div class="image-section">
    </div>

    <!-- Área de cadastro -->
    <div class="login-section">
      <img class="logo" src="/logos/logo_vitrinecar.png" alt="VitrineCar">
      <form @submit.prevent="handleCadastro">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          placeholder="user@exemplo.com" 
          required
        />

        <label for="nome">Nome</label>
        <input 
          type="text" 
          id="nome" 
          v-model="nome" 
          placeholder="Nome" 
          required
        />

        <label for="sobrenome">Sobrenome</label>
        <input 
          type="text" 
          id="sobrenome" 
          v-model="sobrenome" 
          placeholder="Sobrenome" 
          required
        />

        <label for="senha">Senha</label>
        <input 
          type="password" 
          id="senha" 
          v-model="senha" 
          placeholder="Senha" 
          required
        />

        <label for="confirmar-senha">Confirmar Senha</label>
        <input 
          type="password" 
          id="confirmar-senha" 
          v-model="confirmarSenha" 
          placeholder="Confirmar senha" 
          required
        />

        <button type="submit">Cadastrar-se</button>

        <router-link to="/login">Já tem conta? Faça seu Login</router-link>
      </form>
    </div>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default {
  name: "TelaCadastro",
  data() {
    return {
      email: "",
      nome: "",
      sobrenome: "",
      senha: "",
      confirmarSenha: "",
    };
  },
  methods: {
    async handleCadastro() {
      if (this.senha !== this.confirmarSenha) {
        alert("As senhas não conferem!");
        return;
      }

      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.senha);
        
        // Atualizar o perfil do usuário
        await updateProfile(userCredential.user, {
          displayName: `${this.nome} ${this.sobrenome}`,
        });

        alert("Cadastro realizado com sucesso!");
        this.$router.push("/login");
      } catch (error) {
        alert("Erro ao cadastrar: " + error.message);
        console.error(error);
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
  background-color: #F3F3F3;
}

/* Container principal ocupando a tela inteira */
.container {
  display: flex;
  width: 100vw;
  height: 100vh;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Área de imagem e logo */
.image-section {
  background: url('/logos/imagem_login.png') center center/cover no-repeat;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 20px;
}

/* Área de cadastro */
.login-section {
  width: 50%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
}

/* Estilo para a logo */
.logo {
  width: 250px;
  height: auto;
  margin: 0 auto 20px;
  display: block;
}

.login-section h2 {
  font-size: 32px;
  color: #531B76;
  margin-bottom: 20px;
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
