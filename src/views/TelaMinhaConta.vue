<template>
   <Navbar />
  <div class="container">
    <!-- Navbar -->
   

    <!-- Conteúdo Principal -->
    <div class="content">
      <h2>Minha Conta</h2>

      <div class="forms-container">
        <!-- Formulário: Meus Dados -->
        <div class="form-section">
          <h3>Meus Dados</h3>
          <form>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="dados.email" disabled />
            </div>
            <div class="form-group">
              <label for="nome">Nome</label>
              <input type="text" id="nome" v-model="dados.nome" placeholder="Nome" />
            </div>
            <div class="form-group">
              <label for="sobrenome">Sobrenome</label>
              <input type="text" id="sobrenome" v-model="dados.sobrenome" placeholder="Sobrenome" />
            </div>
            <div class="form-group">
              <label for="data-nascimento">Data de Nascimento</label>
              <input type="date" id="data-nascimento" v-model="dados.dataNascimento" />
            </div>
            <div class="form-group">
              <label for="cpf">CPF</label>
              <input type="text" id="cpf" v-model="dados.cpf" placeholder="CPF" />
            </div>
          </form>
        </div>

        <!-- Formulário: Endereço e Contato -->
        <div class="form-section">
          <h3>Endereço e Contato</h3>
          <form>
            <div class="form-group">
              <label for="cep">CEP</label>
              <input type="text" id="cep" v-model="endereco.cep" placeholder="CEP" />
            </div>
            <div class="form-group">
              <label for="cidade">Cidade</label>
              <input type="text" id="cidade" v-model="endereco.cidade" placeholder="Cidade" />
            </div>
            <div class="form-group">
              <label for="estado">Estado</label>
              <input type="text" id="estado" v-model="endereco.estado" placeholder="Estado" />
            </div>
            <div class="form-group">
              <label for="telefone">Telefone</label>
              <input type="text" id="telefone" v-model="contato.telefone" placeholder="(81) 9 9999-9999" />
            </div>
            <div class="form-group">
              <label for="email-contato">Email para Contato</label>
              <input type="email" id="email-contato" v-model="contato.email" placeholder="user@exemplo.com" />
            </div>
          </form>
        </div>
      </div>

      <!-- Botão para Salvar Alterações -->
      <button class="save-button" @click="salvarAlteracoes">Salvar Alterações</button>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { getAuth, updateProfile} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default {
  name: "MinhaConta",
  components: {
    Navbar,
  },
  data() {
    return {
      dados: {
        email: "",
        nome: "",
        sobrenome: "",
        dataNascimento: "",
        cpf: "",
      },
      endereco: {
        cep: "",
        cidade: "",
        estado: "",
      },
      contato: {
        telefone: "",
        email: "",
      },
    };
  },
  async created() {
    await this.carregarDadosUsuario();
  },
  methods: {
    async carregarDadosUsuario() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        this.dados.email = user.email;
        this.dados.nome = user.displayName ? user.displayName.split(' ')[0] : "";
        this.dados.sobrenome = user.displayName ? user.displayName.split(' ')[1] || "" : "";

        try {
          const userDoc = doc(db, "usuarios", user.uid);
          const docSnap = await getDoc(userDoc);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            this.dados.nome = userData.nome || "";
            this.dados.sobrenome = userData.sobrenome || "";
            this.dados.dataNascimento = userData.dataNascimento || "";
            this.dados.cpf = userData.cpf || "";
            this.endereco.cep = userData.endereco?.cep || "";
            this.endereco.cidade = userData.endereco?.cidade || "";
            this.endereco.estado = userData.endereco?.estado || "";
            this.contato.telefone = userData.contato?.telefone || "";
            this.contato.email = userData.contato?.email || "";
          }
        } catch (error) {
          console.error("Erro ao carregar os dados:", error);
        }
      } else {
        alert("Usuário não autenticado.");
        this.$router.push("/");
      }
    },
    async salvarAlteracoes() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {

          await updateProfile(user, {
            displayName: `${this.dados.nome} ${this.dados.sobrenome}`
          });
          
          const userDoc = doc(db, "usuarios", user.uid);
          await setDoc(userDoc, {
            nome: this.dados.nome,
            sobrenome: this.dados.sobrenome,
            dataNascimento: this.dados.dataNascimento,
            cpf: this.dados.cpf,
            endereco: {
              cep: this.endereco.cep,
              cidade: this.endereco.cidade,
              estado: this.endereco.estado,
            },
            contato: {
              telefone: this.contato.telefone,
              email: this.contato.email,
            },
          }, { merge: true });
          alert("Alterações salvas com sucesso!");
        } else {
          alert("Usuário não autenticado.");
        }
      } catch (error) {
        console.error("Erro ao salvar os dados:", error);
        alert("Erro ao salvar os dados.");
      }
    },
  },
};
</script>

<style scoped>
.container {
  width: 80%;
  margin: 0 auto;
  padding: 20px 0;
}

.content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #5b3199;
  margin-bottom: 20px;
}

.forms-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.form-section {
  flex: 1;
  background-color: #f3f3f3;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #5b3199;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.save-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #5b3199;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.save-button:hover {
  background-color: #4a287d;
}
</style>
