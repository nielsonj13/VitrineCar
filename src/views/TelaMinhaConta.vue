<template>
    <div class="container">
      <!-- Navbar -->
      <Navbar />
  
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
                <input type="email" id="email" v-model="dados.email" placeholder="user@exemplo.com" />
              </div>
              <div class="form-group">
                <label for="nome">Nome</label>
                <input type="text" id="nome" v-model="dados.nome" placeholder="nome" />
              </div>
              <div class="form-group">
                <label for="sobrenome">Sobrenome</label>
                <input type="text" id="sobrenome" v-model="dados.sobrenome" placeholder="sobrenome" />
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
                <input type="text" id="cidade" v-model="endereco.cidade" placeholder="cidade" />
              </div>
              <div class="form-group">
                <label for="estado">Estado</label>
                <input type="text" id="estado" v-model="endereco.estado" placeholder="estado" />
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
  
  export default {
    name: "MinhaConta",
    components: {
      Navbar,
    },
    data() {
      return {
        dados: {
          email: "user@exemplo.com",
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
    methods: {
      salvarAlteracoes() {
        alert("Alterações salvas com sucesso!");
        console.log({
          dados: this.dados,
          endereco: this.endereco,
          contato: this.contato,
        });
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