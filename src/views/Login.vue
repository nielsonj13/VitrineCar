<template>
  <div>
    <div class="container login-background">
      <div class="row login-container">
        <!-- Área da imagem -->
        <div class="col-md-6 image-section"></div>

        <!-- Área de login -->
        <div class="col-md-6 login-section">
          <img src="/public/logos/logo_vitrinecar.png" alt="VitrineCar" class="login-logo">

          <h2>Acesse sua conta</h2>

          <form @submit.prevent="login">
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

            <div class="mb-3 password-container">
              <label for="password">Senha</label>
              <div class="input-group">
                <input 
                  :type="mostrarSenha ? 'text' : 'password'" 
                  v-model="password" 
                  id="password" 
                  class="form-control" 
                  placeholder="Digite sua senha" 
                  required 
                />
                <button type="button" class="toggle-password" @click="mostrarSenha = !mostrarSenha">
                  <i :class="mostrarSenha ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary">Entrar</button>

            <div class="text-center mt-3  links-container">
              <router-link to="/esqueceu-senha">Esqueceu a senha?</router-link>
              <router-link to="/cadastro">Cadastre-se</router-link>
              <router-link to="/verificar-email">Reenviar e-mail de verificação</router-link>
            </div>
            <!-- Botão de voltar no final do container -->
          <button type="button" class="btn-link-secondary voltar-btn" @click="voltarParaPrincipal">
            ← Voltar para a Tela Principal
          </button>
          </form>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

export default {
  name: "Login",
  data() {
    return { 
      email: "", 
      password: "",
      mostrarSenha: false,
    };
  },
  methods: {
    async login() {
      try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        // Verificação se o e-mail está confirmado
        if (user.emailVerified) {
          this.$router.push('/');
        } else {
          await signOut(auth);  // Desloga o usuário caso o e-mail não esteja verificado
          alert("Por favor, verifique seu e-mail antes de fazer login.");
        }
      } catch (error) {
        alert("Erro ao fazer login: " + error.message);
        console.error(error);
      }
    },
    voltarParaPrincipal() {
      this.$router.push('/');
    }
  },
};
</script>

<style scoped>
/* Fundo da tela */
.login-background {
  background-color: #f3f3f3;
  height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Card de login */
.login-container {
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

/* Formulário de login */
.login-section {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  position: relative; /* Necessário para que o botão absoluto funcione corretamente */
  padding-bottom: 40px;
}

.login-section h2 {
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #343a40;
}

.form-control {
  padding: 12px;
  font-size: 16px;
  width: 100%;
}

/* Ajustando o botão de alternar senha */
.password-container {
  position: relative;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #5B3199;
}

.toggle-password:hover {
  color: #3a1e66;
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

/* Novo botão menor e discreto */
.btn-link-secondary {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  display: block;
  text-align: center;
  margin-top: 10px;
  margin-top: auto; /* Faz o botão ficar no final */
}

.voltar-btn {
  position: absolute;
  bottom: 10px; /* Mantém o botão fixo na parte inferior */
  left: 50%;
  transform: translateX(-50%); /* Centraliza o botão */
  background: none;
  border: none;
  color: #6c757d;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
}

.voltar-btn:hover {
  color: #343a40;
  text-decoration: underline;
}

.login-logo {
  display: block;
  max-width: 250px; /* Define um tamanho máximo para a logo */
  margin: 0 auto 15px auto; /* Centraliza a logo e adiciona espaçamento abaixo */
}

.btn-link-secondary:hover {
  color: #343a40;
  text-decoration: underline;
}

.links-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza os links */
  gap: 5px; /* Espaçamento entre os links */
}

.links-container a {
  color: #5B3199;
  text-decoration: none;
  font-size: 14px;
}

.links-container a:hover {
  text-decoration: underline;
}

.text-center a {
  color: #5B3199;
  text-decoration: none;
  margin-right: 15px;
}

.text-center a:hover {
  text-decoration: underline;
}
</style>
