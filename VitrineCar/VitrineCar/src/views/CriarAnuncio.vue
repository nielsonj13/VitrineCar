<template>
    <Navbar />
    <div class="container">
      
      <div v-if="etapa === 1" class="content">
        <h2>Criar Anúncio</h2>
        <h3>Preencha as informações do veículo</h3>
        <div class="form">
          <div class="form-group">
            <label>Marca</label>
            <select v-model="anuncio.marca">
              <option value="">Escolha a marca</option>
              <option>Fiat</option>
              <option>Chevrolet</option>
              <option>Volkswagen</option>
            </select>
          </div>
          <div class="form-group">
            <label>Modelo</label>
            <select v-model="anuncio.modelo">
              <option value="">Escolha o modelo</option>
              <option>Pulse</option>
              <option>Onix</option>
              <option>Golf</option>
            </select>
          </div>
          <div class="form-group">
            <label>Ano do Modelo</label>
            <select v-model="anuncio.anoModelo">
              <option value="">Escolha um ano</option>
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
            </select>
          </div>
          <div class="form-group">
            <label>Cor</label>
            <select v-model="anuncio.cor">
              <option value="">Escolha uma cor</option>
              <option>Preto</option>
              <option>Branco</option>
              <option>Vermelho</option>
            </select>
          </div>
        </div>
        <button class="btn-next" @click="avancarEtapa">Próximo</button>
      </div>
  
      <div v-else-if="etapa === 2" class="content">
        <h2>Criar Anúncio</h2>
        <h3>Informe os opcionais do veículo</h3>
        <div class="opcionais">
          <div
            v-for="opcional in opcionais"
            :key="opcional"
            class="opcional"
            :class="{ active: anuncio.opcionais.includes(opcional) }"
            @click="toggleOpcional(opcional)"
          >
            {{ opcional }}
          </div>
        </div>
        <div class="actions">
          <button class="btn-back" @click="voltarEtapa">Voltar</button>
          <button class="btn-next" @click="avancarEtapa">Próximo</button>
        </div>
      </div>
  
      <div v-else-if="etapa === 3" class="content">
        <h2>Criar Anúncio</h2>
        <h3>Adicionar fotos do veículo</h3>
        <div class="upload-box">
          <label for="upload" class="upload-label">
            <span>Upload de imagens</span>
            <input type="file" id="upload" class="upload-input" @change="uploadImagens" multiple />
          </label>
        </div>
        <div class="actions">
          <button class="btn-back" @click="voltarEtapa">Voltar</button>
          <button class="btn-finish" @click="finalizarAnuncio">Finalizar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from '../components/NavBar.vue';
  
  export default {
    name: "CriarAnuncio",
    components: {
      Navbar,
    },
    data() {
      return {
        etapa: 1,
        anuncio: {
          marca: "",
          modelo: "",
          anoModelo: "",
          cor: "",
          opcionais: [],
          imagens: [],
        },
        opcionais: [
          "Air Bag",
          "Alarme",
          "Ar Condicionado",
          "Travas Elétricas",
          "Vidros Elétricos",
          "Freio ABS",
          "Computador de bordo",
          "Teto Solar",
          "Tração 4X4",
          "Desembaçador Traseiro",
        ],
      };
    },
    methods: {
      avancarEtapa() {
        if (this.etapa < 3) this.etapa++;
      },
      voltarEtapa() {
        if (this.etapa > 1) this.etapa--;
      },
      toggleOpcional(opcional) {
        const index = this.anuncio.opcionais.indexOf(opcional);
        if (index === -1) this.anuncio.opcionais.push(opcional);
        else this.anuncio.opcionais.splice(index, 1);
      },
      uploadImagens(event) {
        const files = event.target.files;
        this.anuncio.imagens = [...files];
      },
      finalizarAnuncio() {
        alert("Anúncio finalizado com sucesso!");
        console.log(this.anuncio);
      },
    },
  };
  </script>
  
  <style scoped>
    /* Estilo Base */
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background-color: #F3F3F3;
    }
    
    .container {
      max-width: 1400px;
      margin: 20px auto;
      background-color: white;
      border-radius: 10px;
      padding: 20px;
  
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .logo {
      width: 150px;
    }
    
    .menu {
      display: flex;
      gap: 15px;
      list-style: none;
    }
    
    .menu li a {
      text-decoration: none;
      color: #5b3199;
      font-weight: bold;
    }
    
    .content {
      text-align: center;
    }
    
    h2 {
      color: #5b3199;
      margin-bottom: 20px;
    }
    
    h3 {
      color: #333;
      margin-bottom: 20px;
    }
    
    .form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
    }
    
    .form-group label {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .opcionais {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .opcional {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
    }
    
    .opcional.active {
      background-color: #5b3199;
      color: white;
      border: 1px solid #5b3199;
    }
    
    .upload-box {
      border: 2px dashed #5b3199;
      padding: 20px;
      border-radius: 10px;
      background-color: #f9f9f9;
      color: #5b3199;
      font-weight: bold;
    }
    
    .actions {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    
    .btn-next {
      background-color: #5b3199;
      color: white;
    }
    
    .btn-back {
      background-color: #ccc;
    }
    
    .btn-finish {
      background-color: #28a745;
      color: white;
    }
    </style>