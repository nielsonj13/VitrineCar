<template>
  <div class="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="row shadow-lg rounded overflow-hidden login-container">
      <!-- Área da imagem -->
      <div class="col-md-6 d-none d-md-flex align-items-center justify-content-center image-section">
      </div>

      <!-- Área de cadastro -->
      <div class="col-md-6 p-5 bg-white form-section">
        <h2 class="fw-bold text-center mb-3">Crie sua conta</h2>

        <form @submit.prevent="handleCadastro">
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
            <label for="nome" class="form-label">Nome</label>
            <input 
              type="text" 
              v-model="nome" 
              id="nome" 
              class="form-control" 
              placeholder="Digite seu nome" 
              required
            />
          </div>

          <div class="mb-3">
            <label for="sobrenome" class="form-label">Sobrenome</label>
            <input 
              type="text" 
              v-model="sobrenome" 
              id="sobrenome" 
              class="form-control" 
              placeholder="Digite seu sobrenome" 
              required
            />
          </div>

          <div class="mb-3">
            <label for="senha" class="form-label">Senha</label>
            <input 
              type="password" 
              v-model="senha" 
              id="senha" 
              class="form-control" 
              placeholder="Digite sua senha" 
              required
            />
          </div>

          <div class="mb-3">
            <label for="confirmar-senha" class="form-label">Confirmar Senha</label>
            <input 
              type="password" 
              v-model="confirmarSenha" 
              id="confirmar-senha" 
              class="form-control" 
              placeholder="Confirme sua senha" 
              required
            />
          </div>

          <button type="submit" class="btn btn-primary w-100 py-2">
            Cadastrar-se
          </button>

          <div class="text-center mt-3">
            <router-link to="/login" class="text-decoration-none">Já tem uma conta? Faça login</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

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
      try {
        if (!this.email || !this.nome || !this.sobrenome || !this.senha || !this.confirmarSenha) {
          alert("Preencha todos os campos obrigatórios!");
          return;
        }
        if (this.senha !== this.confirmarSenha) {
          alert("As senhas não conferem!");
          return;
        }

        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.senha);
        const user = userCredential.user;
        
        await updateProfile(user, {
          displayName: `${this.nome} ${this.sobrenome}`,
        });

        const userRef = doc(db, "usuarios", user.uid);
        await setDoc(userRef, {
          nome: this.nome,
          sobrenome: this.sobrenome,
          email: this.email,
          endereco: { cidade: "", estado: "", cep: "" },
          contato: { telefone: "", email: this.email }
        });

        alert("Cadastro realizado com sucesso!");
        this.$router.push("/");
      } catch (error) {
        alert("Erro ao cadastrar: " + error.message);
        console.error(error);
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
