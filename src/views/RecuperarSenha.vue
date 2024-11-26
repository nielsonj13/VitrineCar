<template>
  <div class="container">
    <!-- Seção da imagem -->
    <div class="image-section">
    </div>

    <!-- Seção do formulário -->
    <div class="form-section">
      <img class="logo" src="/public/logos/logo_vitrinecar.png" alt="VitrineCar">
      <h2 class="form-title">Criar Nova Senha</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="nova-senha">Nova Senha</label>
          <input 
            type="password" 
            id="nova-senha" 
            v-model="novaSenha" 
            placeholder="nova senha" 
          />
        </div>
        <div class="form-group">
          <label for="confirmar-senha">Confirmar Senha</label>
          <input 
            type="password" 
            id="confirmar-senha" 
            v-model="confirmarSenha" 
            placeholder="confirmar senha" 
          />
        </div>
        <button type="submit" class="submit-button">Enviar</button>
      </form>
      <div class="form-footer">
        <p>Retornar para <router-link to="/">Login</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecuperarSenha",
  data() {
    return {
      novaSenha: "",
      confirmarSenha: "",
    };
  },
  methods: {
    handleSubmit() {
      if (this.novaSenha === this.confirmarSenha) {
        alert("Senha alterada com sucesso!");
        // Aqui você pode implementar a lógica de envio para o backend
      } else {
        alert("As senhas não conferem!");
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

.container {
  display: flex;
  width: 100vw; /* Agora ocupa toda a largura da tela */
  height: 100vh; /* Agora ocupa toda a altura da tela */
  background-color: #FFF;
}

/* Estilo da imagem e fundo do carro */
.image-section {
  background-image: url('/public/logos/imagem_login.png'); /* Certifique-se de que o caminho da imagem esteja correto */
  background-size: cover;
  background-position: center;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

/* Texto sobreposto na imagem */
.image-section h1 {
  font-size: 32px;
  margin: 0;
}

.image-section p {
  font-size: 16px;
}

/* Seção do formulário */
.form-section {
  padding: 40px;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Estilo da logo */
.logo {
  width: 250px; /* Reduz o tamanho da logo */
  height: auto;
  margin: 0 auto 5px; /* Margem inferior reduzida ainda mais */
  display: block;
}

/* Título do formulário */
.form-title {
  color: #531B76;
  margin: 5px 0 20px; /* Margem superior reduzida ainda mais */
  font-size: 28px;
  text-align: center;
}

/* Subtítulo e instruções */
.form-section h3 {
  margin: 10px 0 20px;
  font-size: 20px;
  color: #5B3199;
  text-align: left;
  font-weight: bold;
}

/* Campos de entrada */
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

/* Botão de envio */
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

.submit-button:hover {
  background-color: #4a287d;
}

/* Link de retorno */
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
