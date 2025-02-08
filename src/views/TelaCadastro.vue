<template>
  <div>
    <div class="container register-background">
      <div class="row register-container">
        <div class="col-md-6 image-section"></div>

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

            <div class="mb-3 password-container">
              <label for="senha">Senha</label>
              <div class="input-group">
                <input 
                  :type="mostrarSenha ? 'text' : 'password'" 
                  v-model="senha" 
                  id="senha" 
                  class="form-control" 
                  placeholder="Digite sua senha" 
                  required 
                />
                <button type="button" class="toggle-password" @click="mostrarSenha = !mostrarSenha">
                  <i :class="mostrarSenha ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                </button>
              </div>
            </div>

            <div class="mb-3 password-container">
              <label for="confirmar-senha">Confirmar Senha</label>
              <div class="input-group">
                <input 
                  :type="mostrarConfirmarSenha ? 'text' : 'password'" 
                  v-model="confirmarSenha" 
                  id="confirmar-senha" 
                  class="form-control" 
                  placeholder="Confirme sua senha" 
                  required 
                />
                <button type="button" class="toggle-password" @click="mostrarConfirmarSenha = !mostrarConfirmarSenha">
                  <i :class="mostrarConfirmarSenha ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                </button>
              </div>
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
      mostrarSenha: false,
      mostrarConfirmarSenha: false,
    };
  },
  methods: {
    async handleCadastro() {
      try {
        if (!this.email || !this.nome || !this.sobrenome || !this.senha || !this.confirmarSenha) {
          alert("⚠️ Preencha todos os campos obrigatórios!");
          return;
        }
        if (this.senha !== this.confirmarSenha) {
          alert("❌ As senhas digitadas não coincidem. Verifique e tente novamente.");
          return;
        }

        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.senha);
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: `${this.nome} ${this.sobrenome}`,
        });

        await sendEmailVerification(user);
        alert("✅ Cadastro realizado com sucesso! Verifique seu e-mail para ativar a conta.");

        await signOut(auth);
        this.$router.push("/login");

      } catch (error) {
        this.tratarErros(error);
      }
    },

    tratarErros(error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          alert(" Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.");
          break;
        case "auth/weak-password":
          alert(" A senha deve ter pelo menos 6 caracteres.");
          break;
        default:
          alert(" Erro ao cadastrar. Verifique os dados e tente novamente.");
      }
    }
  }
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
  max-width: 250px;
  margin: 0 auto 15px auto;
}
</style>
