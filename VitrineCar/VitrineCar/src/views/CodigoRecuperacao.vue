<template>
    <div class="container">
      <!-- Área da imagem e logo -->
      <div class="image-section">
      </div>
  
      <!-- Área do formulário -->
      <div class="login-section">
        <img class="logo" src="/public/logos/logo_vitrinecar.png" alt="VitrineCar">
        <h2>Digite o Código:</h2>
        <p>Para criar uma nova senha, digite abaixo o código de 6 dígitos que enviamos para o seu e-mail.</p>
        
        <form @submit.prevent="handleSubmit">
          <label for="codigo">Código</label>
          <input type="text" id="codigo" v-model="codigo" placeholder="Informe o código">
          
          <p style="text-align: left; font-size: 14px; color: #666;">
            Não recebeu o código? <a href="#" @click.prevent="reenviarCodigo">Reenviar código</a>
          </p>
          
          <button type="submit">Enviar</button>
          
          <router-link to="/">Retornar para Login</router-link>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "CodigoDeRecuperacao",
    data() {
      return {
        codigo: "",
      };
    },
    methods: {
      handleSubmit() {
        if (this.codigo.length !== 6) {
          alert("O código deve ter 6 dígitos.");
        } else {
          alert(`Código recebido: ${this.codigo}`);
          // Adicione aqui a lógica para enviar o código ao backend
        }
      },
      reenviarCodigo() {
        alert("Código reenviado para o seu e-mail!");
        // Adicione aqui a lógica para reenviar o código
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
    background: url('/public/logos/imagem_login.png') center center/cover no-repeat;
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
  
  /* Área do formulário */
  .login-section {
    width: 50%;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px;
  }
  
  /* Logo */
  .logo {
    display: block;
    margin: 0 auto 20px; /* Centraliza horizontalmente e adiciona espaço inferior */
    width: 250px; /* Aumenta o tamanho da logo */
    height: auto; /* Mantém a proporção da imagem */
  }
  
  /* Títulos e textos */
  .login-section h2 {
    font-size: 32px;
    color: #531B76;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .login-section p {
    font-size: 14px;
    color: #666;
    text-align: center;
    margin-bottom: 20px;
  }
  
  /* Inputs */
  .login-section label {
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
    display: block;
  }
  
  .login-section input[type="text"] {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #CCC;
    border-radius: 5px;
    margin-bottom: 20px;
    background-color: #F3F3F3;
  }
  
  /* Botões */
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
    text-align: center;
    margin-top: 10px;
  }
  
  .login-section a:hover {
    text-decoration: underline;
  }
  </style>
  