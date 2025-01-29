<template>
  <div class="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="row shadow-lg rounded overflow-hidden login-container">
      <!-- Área da imagem -->
      <div class="col-md-6 d-none d-md-flex align-items-center justify-content-center image-section">
      </div>

      <!-- Área de login -->
      <div class="col-md-6 p-5 bg-white login-section">
        <h2 class="fw-bold text-center mb-4">Acesse sua conta</h2>

        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
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
            <label for="password" class="form-label">Senha</label>
            <input 
              type="password" 
              v-model="password" 
              id="password" 
              class="form-control" 
              placeholder="Digite sua senha" 
              required 
            />
          </div>

          <button type="submit" class="btn btn-primary w-100 py-2">Entrar</button>

          <div class="text-center mt-3">
            <router-link to="/esqueceu-senha" class="text-decoration-none me-3">Esqueceu a senha?</router-link>
            <router-link to="/cadastro" class="text-decoration-none">Cadastre-se</router-link>
          </div>
        </form>
      </div>
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
/* Layout principal */
.login-container {
  max-width: 900px;
  width: 100%;
  background: #fff;
  border-radius: 15px;
}

/* Estilo da área de imagem */
.image-section {
  background: url('/logos/imagem_login.png') no-repeat center center;
  background-size: cover;
  position: relative;
}

.overlay {
  position: absolute;
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}

.highlight {
  color: #FFC107;
}

/* Formulário de login */
.login-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-section h2 {
  color: #343a40;
}

.form-control {
  padding: 12px;
  font-size: 16px;
}

.btn-primary {
  background: #5B3199;
  border: none;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #3a1e66;
}

.text-decoration-none {
  color: #5B3199;
}

.text-decoration-none:hover {
  text-decoration: underline;
}
</style>
