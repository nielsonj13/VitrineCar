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
              <input type="text" id="cpf" v-model="dados.cpf" placeholder="000.000.000-00" @input="formatarCPF" @blur="validarCPF"/>
            </div>
          </form>
        </div>

        <!-- Formulário: Endereço e Contato -->
        <div class="form-section">
          <h3>Endereço e Contato</h3>
          <form>
            <div class="form-group">
              <label for="cep">CEP</label>
              <input type="text" id="cep" v-model="endereco.cep" @blur="buscarCep" @input="formatarCEP" placeholder="00000-000" />
            </div>
            <div class="form-group">
              <label for="cidade">Cidade</label>
              <input type="text" id="cidade" v-model="endereco.cidade" placeholder="Cidade" disabled />
            </div>
            <div class="form-group">
              <label for="estado">Estado</label>
              <input type="text" id="estado" v-model="endereco.estado" placeholder="Estado" disabled />
            </div>
            <div class="form-group">
              <label for="telefone">Telefone</label>
              <input type="text" id="telefone" v-model="contato.telefone" @input="formatarTelefone" placeholder="(99) 99999-9999" />
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
      <button class="delete-button" @click="excluirConta">Excluir Conta</button>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import { getAuth, updateProfile, deleteUser, reauthenticateWithCredential, EmailAuthProvider} from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc} from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios"; 
import DAOService from "@/Services/DAOService";
import FavoritosService from "@/Services/FavoritosService";

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

    formatarCEP() {
      let cep = this.endereco.cep.replace(/\D/g, ""); // Remove tudo que não for número

      if (cep.length > 8) {
        cep = cep.slice(0, 8); // Limita o tamanho máximo
      }


      this.endereco.cep = cep;
    },

    async buscarCep() {
      if (this.endereco.cep.length === 8) {
        try {
          const response = await axios.get(`https://viacep.com.br/ws/${this.endereco.cep}/json/`);
          if (response.data.erro) {
            alert("CEP não encontrado!");
          } else {
            this.endereco.cidade = response.data.localidade;
            this.endereco.estado = response.data.uf;
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
          alert("Erro ao buscar CEP.");
        }
      }
    },

    formatarTelefone() {
      let telefone = this.contato.telefone.replace(/\D/g, ""); // Remove tudo que não for número

      if (telefone.length > 11) {
        telefone = telefone.slice(0, 11); // Limita o tamanho máximo
      }

      // Aplica a máscara (99) 99999-9999
      if (telefone.length <= 10) {
        telefone = telefone.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
      } else {
        telefone = telefone.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
      }

      this.contato.telefone = telefone;
    },

    formatarCPF() {
      let cpf = this.dados.cpf.replace(/\D/g, ""); // Remove tudo que não for número

      if (cpf.length > 3) cpf = cpf.replace(/^(\d{3})(\d)/, "$1.$2");
      if (cpf.length > 6) cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
      if (cpf.length > 9) cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

      this.dados.cpf = cpf.substring(0, 14); // Garante no máximo 14 caracteres
    },

    validarCPF() {
      const cpf = this.dados.cpf.replace(/\D/g, ""); // Remove caracteres não numéricos

      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        alert("CPF inválido!");
        this.dados.cpf = ""; // Limpa o campo se for inválido
        return false;
      }

      let soma = 0, resto;
      for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf[9])) {
        alert("CPF inválido!");
        this.dados.cpf = "";
        return false;
      }

      soma = 0;
      for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf[10])) {
        alert("CPF inválido!");
        this.dados.cpf = "";
        return false;
      }

      return true;
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

    async excluirConta() {
  if (confirm("Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("Nenhum usuário autenticado.");
        return;
      }

      // Reautenticar o usuário antes de excluir
      const senha = prompt("Para segurança, insira sua senha:");

      if (!senha) {
        alert("A senha é necessária para confirmar a exclusão.");
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, senha);
      await reauthenticateWithCredential(user, credential);

      const userId = user.uid;

      // 🔹 1. Exclui os anúncios do usuário
      const anunciosService = new DAOService("anuncios");
      const anunciosUsuario = await anunciosService.getAll();
      const anunciosParaExcluir = anunciosUsuario.filter(anuncio => anuncio.userId === userId);

      for (const anuncio of anunciosParaExcluir) {
        await anunciosService.delete(anuncio.id);
      }

      // 🔹 2. Exclui os favoritos do usuário
      await FavoritosService.removerTodosFavoritosDoUsuario(userId);

      // 🔹 3. Exclui os dados do usuário no Firestore
      const userRef = doc(db, "usuarios", userId);
      await deleteDoc(userRef);

      // 🔹 4. Exclui o usuário do Firebase Authentication
      await deleteUser(user);

      alert("Conta excluída com sucesso.");
      this.$router.push("/");

    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      alert("Erro ao excluir conta. Verifique se a senha está correta e tente novamente.");
    }
  }
}


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

.delete-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.delete-button:hover {
  background-color: #c82333;
}

@media (max-width: 768px) {
  .forms-container {
    flex-direction: column;
  }
  .form-section {
    width: 100%;
  }
  .save-button {
    font-size: 14px;
  }
}
</style>
