<template>
  <div>
    <div class="container register-background">
      <div class="row register-container">
        <!-- Área da imagem -->
        <div class="col-md-6 image-section"></div>

        <!-- Área de cadastro -->
        <div class="col-md-6 form-section">
          <h2>Crie sua conta</h2>

          <form @submit.prevent="handleCadastro">
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

            <div class="mb-3">
              <label for="nome">Nome</label>
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
              <label for="sobrenome">Sobrenome</label>
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
              <label for="senha">Senha</label>
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
              <label for="confirmar-senha">Confirmar Senha</label>
              <input 
                type="password" 
                v-model="confirmarSenha" 
                id="confirmar-senha" 
                class="form-control" 
                placeholder="Confirme sua senha" 
                required 
              />
            </div>

            <button type="submit" class="btn btn-primary" :disabled="verificandoEmail">
              {{ verificandoEmail ? 'Verificando e-mail...' : 'Cadastrar-se' }}
            </button>

            <div class="text-center mt-3">
              <router-link to="/login">Já tem uma conta? Faça login</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from "firebase/auth";
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
      verificandoEmail: false,
      verificarInterval: null,
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

        // Enviar e-mail de verificação
        await sendEmailVerification(user);
        alert("Cadastro iniciado com sucesso! Verifique seu e-mail para ativar a conta.");

        // Deslogar o usuário após o cadastro
        await signOut(auth);

        // Iniciar verificação contínua do e-mail
        this.verificandoEmail = true;
        this.verificarInterval = setInterval(async () => {
          const auth = getAuth();
          const currentUser = auth.currentUser;

          if (currentUser) {
            await currentUser.reload();
            if (currentUser.emailVerified) {
              clearInterval(this.verificarInterval);
              await this.finalizarCadastro(currentUser);
            }
          }
        }, 3000); // Verifica a cada 3 segundos

      } catch (error) {
        alert("Erro ao cadastrar: " + error.message);
        console.error(error);
        this.verificandoEmail = false;
      }
    },

    async finalizarCadastro(user) {
      try {
        const userRef = doc(db, "usuarios", user.uid);
        await setDoc(userRef, {
          nome: this.nome,
          sobrenome: this.sobrenome,
          email: this.email,
          endereco: { cidade: "", estado: "", cep: "" },
          contato: { telefone: "", email: this.email }
        });

        
        this.verificandoEmail = false;
        
      } catch (error) {
        console.error("Erro ao finalizar o cadastro:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Fundo da tela */
.register-background {
  background-color: #f3f3f3;
  height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Card de cadastro */
.register-container {
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
