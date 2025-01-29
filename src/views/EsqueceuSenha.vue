<template>
  <div class="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="row shadow-lg rounded overflow-hidden login-container">
      <!-- Área da imagem -->
      <div class="col-md-6 d-none d-md-flex align-items-center justify-content-center image-section">
      </div>

      <!-- Área do formulário -->
      <div class="col-md-6 p-5 bg-white form-section">
        <h2 class="fw-bold text-center mb-3">Esqueceu sua senha?</h2>
        <p class="text-center text-muted">Informe seu email cadastrado para receber instruções de redefinição de senha</p>

        <form @submit.prevent="recuperarSenha">
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

          <button type="submit" class="btn btn-primary w-100 py-2" :disabled="loading">
            {{ loading ? "Enviando..." : "Enviar" }}
          </button>

          <div class="text-center mt-3">
            <router-link to="/login" class="text-decoration-none">Voltar para Login</router-link>
          </div>
        </form>
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

/* Formulário */
.form-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-section h2 {
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
