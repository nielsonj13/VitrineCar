<template>
    <div class="container">
      <!-- Área da imagem e logo -->
      <div class="image-section">
      </div>
  
      <!-- Área de cadastro -->
      <div class="login-section">
        <img class="logo" src="/public/logos/logo_vitrinecar.png" alt="VitrineCar">
        <form @submit.prevent="handleCadastro">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="user@exemplo.com" 
          />
  
          <label for="nome">Nome</label>
          <input 
            type="text" 
            id="nome" 
            v-model="nome" 
            placeholder="nome" 
          />
  
          <label for="sobrenome">Sobrenome</label>
          <input 
            type="text" 
            id="sobrenome" 
            v-model="sobrenome" 
            placeholder="sobrenome" 
          />
  
          <label for="senha">Senha</label>
          <input 
            type="password" 
            id="senha" 
            v-model="senha" 
            placeholder="senha" 
          />
  
          <label for="confirmar-senha">Confirma Senha</label>
          <input 
            type="password" 
            id="confirmar-senha" 
            v-model="confirmarSenha" 
            placeholder="confirmar senha" 
          />
  
          <button type="submit">Cadastrar-se</button>
  
          <router-link to="/">Já tem conta? Faça seu Login</router-link>
        </form>
      </div>
    </div>
  </template>
  
  <script>
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
      handleCadastro() {
        if (this.senha !== this.confirmarSenha) {
          alert("As senhas não conferem!");
        } else {
          alert(`Cadastro realizado com sucesso!\nEmail: ${this.email}`);
          // Aqui você pode implementar a lógica de envio para backend
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
    width: 100vw;
    height: 100vh;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  /* Área de imagem e logo */
  .image-section {
    background: url('/public/logos/imagem_login.png') center center/cover no-repeat; /* Certifique-se de usar a imagem correta */
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    text-align: center;
    padding: 20px;
  }
  
  .image-section h1 {
    font-size: 32px;
    font-weight: bold;
    color: #FFFFFF;
  }
  
  .image-section p {
    font-size: 14px;
    margin-top: 10px;
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
    width: 250px; /* Ajuste o tamanho desejado */
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
  
  .login-section input[type="text"],
  .login-section input[type="email"],
  .login-section input[type="password"] {
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
  