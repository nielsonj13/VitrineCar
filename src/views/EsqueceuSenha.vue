<template>
  <div>

    <div class="container forgot-password-background">
      <div class="row forgot-password-container">
        <!-- Área da imagem -->
        <div class="col-md-6 image-section"></div>

        <!-- Área do formulário -->
        <div class="col-md-6 form-section">
          <img src="/public/logos/logo_vitrinecar.png" alt="VitrineCar" class="logo">

          <h2>Esqueceu sua senha?</h2>
          <p>Informe seu email cadastrado para receber instruções de redefinição de senha</p>

          <form @submit.prevent="recuperarSenha">
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

            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? "Enviando..." : "Enviar" }}
            </button>

            <div class="text-center mt-3">
              <router-link to="/login">Voltar para Login</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

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
        alert("⚠️ Por favor, insira seu email!");
        return;
      }

      this.loading = true;
      const auth = getAuth();
      const db = getFirestore();

      try {
        // 🔹 1️⃣ Verifica no Firestore se o email está cadastrado
        const usuariosRef = collection(db, "usuarios");
        const q = query(usuariosRef, where("email", "==", this.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          alert("❌ O email informado não está cadastrado. Verifique e tente novamente.");
          this.loading = false;
          return;
        }

        // 🔹 2️⃣ Se o email existir, envia a solicitação de redefinição de senha
        await sendPasswordResetEmail(auth, this.email);
        alert(`✅ Instruções enviadas para o email: ${this.email}`);
        this.email = "";
        this.$router.push("/login");

      } catch (error) {
        alert("⚠️ Erro ao enviar email de recuperação. Tente novamente mais tarde.");
        console.error("Erro ao enviar email de recuperação:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Fundo da tela */
.forgot-password-background {
  background-color: #f3f3f3;
  height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Card de recuperação de senha */
.forgot-password-container {
  width: 95vw;
  max-width: 1400px; /* Igual ao card da tela de login */
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

/* Formulário */
.form-section {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
}

.form-section h2 {
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  color: #343a40;
}

.form-section p {
  text-align: center;
  color: #6c757d;
  margin-bottom: 20px;
}

.form-control {
  padding: 12px;
  font-size: 16px;
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

.text-center a {
  color: #5B3199;
  text-decoration: none;
  margin-top: 10px;
}

.text-center a:hover {
  text-decoration: underline;
}

.logo {
  display: block;
  max-width: 250px; /* Define um tamanho máximo para a logo */
  margin: 0 auto 15px auto; /* Centraliza a logo e adiciona espaçamento abaixo */
}

</style>
