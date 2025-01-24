<template>
  <Navbar />
  <h2>Criar Anúncio</h2>
  <div class="container">
    <div v-if="etapa === 1" class="content">
      <h3>Preencha as informações do veículo</h3>
      <div class="form">
        <div class="form-group">
          <label>Marca</label>
          <input type="text" v-model="anuncio.marca" placeholder="Digite a marca" />
        </div>
        <div class="form-group">
          <label>Modelo</label>
          <input type="text" v-model="anuncio.modelo" placeholder="Digite o modelo" /> 
        </div>
        <div class="form-group">
          <label>Ano do Modelo</label>
          <input type="text" v-model="anuncio.anoModelo" placeholder="Digite o ano do modelo" @input="validateNumberInput('anoModelo')"  @blur="validateAnoModelo"/>
        </div>
        <div class="form-group">
          <label>Ano de Fabricação</label>
          <input type="text" v-model="anuncio.anoFabricacao" placeholder="Digite o ano de fabricação"  @input="validateNumberInput('anoFabricacao')"  @blur="validateAnoModelo"/>
        </div>
        <div class="form-group">
          <label>Quilometragem (km)</label>
          <input type="text" v-model="anuncio.km" placeholder="Digite a quilometragem" @input="validateNumberInput('km')"/>
        </div>
        <div class="form-group">
          <label>Cor</label>
          <select v-model="anuncio.cor">
            <option value="">Escolha uma cor</option>
            <option>Preto</option>
            <option>Branco</option>
            <option>Vermelho</option>
            <option>Prata</option>
            <option>Cinza</option>
          </select>
        </div>
        <div class="form-group">
          <label>Câmbio</label>
          <select v-model="anuncio.cambio">
            <option value="">Escolha o tipo de câmbio</option>
            <option>Automático</option>
            <option>Manual</option>
          </select>
        </div>
        <div class="form-group">
          <label>Categoria</label>
          <select v-model="anuncio.categoria">
            <option value="">Escolha a categoria</option>
            <option>Sedan</option>
            <option>SUV</option>
            <option>Picape</option>
            <option>Hatch</option>
          </select>
        </div>
        <div class="form-group">
          <label>Combustível</label>
          <select v-model="anuncio.combustivel">
            <option value="">Escolha o tipo de combustível</option>
            <option>Gasolina</option>
            <option>Diesel</option>
            <option>Etanol</option>
            <option>Híbrido</option>
            <option>Flex</option>
            <option>Elétrico</option>
          </select>
        </div>
        <div class="form-group">
          <label>Valor</label>
          <input type="text" v-model="anuncio.valor" placeholder="Digite o valor do veículo" class="input-valor" @input="validateNumberInput('valor')"/>
        </div>
      </div>
      <div class="actions">
        <button class="btn-next" @click="avancarEtapa">Próximo</button>
      </div>
    </div>

    <div v-else-if="etapa === 2" class="content">
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
      <h3>Adicionar fotos do veículo</h3>
      <div class="upload-box">
        <div class="form-group">
          <label>Link da Imagem 1</label>
          <input type="text" v-model="anuncio.imagens[0]" placeholder="Insira o link da imagem" />
        </div>
        <div class="form-group">
          <label>Link da Imagem 2</label>
          <input type="text" v-model="anuncio.imagens[1]" placeholder="Insira o link da imagem" />
        </div>
        <div class="form-group">
          <label>Link da Imagem 3</label>
          <input type="text" v-model="anuncio.imagens[2]" placeholder="Insira o link da imagem" />
        </div>
      </div>
      <div class="actions">
        <button class="btn-back" @click="voltarEtapa">Voltar</button>
        <button class="btn-finish" @click="finalizarAnuncio">Finalizar</button>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import DAOService from "@/Services/DAOService";
import { getAuth } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; 

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
        anoFabricacao: "",
        km: "",
        valor: "",
        cor: "",
        opcionais: [],
        imagens: ["", "", ""],
        userId: null,
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
      daoService: null, 
    };
  },
  created() {
    // Inicializa a instância do DAOService
    this.daoService = new DAOService("anuncios");
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      this.$router.push("/login");  // Redireciona se não estiver logado
    } else {
      this.anuncio.userId = user.uid;  // Vincula o anúncio ao usuário logado
    }
  },
  methods: {
  validateNumberInput(field) {
    this.anuncio[field] = this.anuncio[field].replace(/\D/g, '');
  },
  validateAnoModelo() {
    if (this.anuncio.anoFabricacao && this.anuncio.anoModelo) {
      const anoFabricacao = parseInt(this.anuncio.anoFabricacao);
      const anoModelo = parseInt(this.anuncio.anoModelo);
      if (anoModelo < anoFabricacao || anoModelo > anoFabricacao + 1) {
        alert('O ano do modelo deve ser igual ou no máximo 1 ano a mais que o ano de fabricação.');
        this.anuncio.anoModelo = '';
      }
    }
  },
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
  async uploadImagens(event) {
    const files = event.target.files;
    const promises = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      promises.push(
        new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Progresso do upload
            },
            (error) => reject(error),
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              this.anuncio.imagens.push(downloadURL);
              resolve();
            }
          );
        })
      );
    }

    await Promise.all(promises);
    console.log("Imagens carregadas:", this.anuncio.imagens);
  },

  async finalizarAnuncio() {
    try {
      if (!this.anuncio.marca || !this.anuncio.modelo || !this.anuncio.valor) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }
      if (!this.anuncio.userId) {
        alert("Você precisa estar logado para criar um anúncio.");
        return;
      }

      // Normaliza marca e modelo para minúsculas antes de salvar
      this.anuncio.marca = this.anuncio.marca.trim().toLowerCase();
      this.anuncio.modelo = this.anuncio.modelo.trim().toLowerCase();

      const id = await this.daoService.insert(this.anuncio);
      alert(`Anúncio finalizado com sucesso! ID: ${id}`);
      console.log(this.anuncio);

      this.$router.push("/TelaMeusAnuncios");

      this.resetarFormulario();
    } catch (error) {
      console.error("Erro ao salvar o anúncio:", error);
      alert("Erro ao finalizar o anúncio. Verifique os logs.");
    }
  },

  resetarFormulario() {
    this.etapa = 1;
    this.anuncio = {
      marca: "",
      modelo: "",
      anoModelo: "",
      anoFabricacao: "",
      km: "",
      valor: "",
      cor: "",
      opcionais: [],
      imagens: [],
    };
  },
},

};
</script>

<style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f3f3f3;
}

.container {
  max-width: 1300px;
  margin: 20px auto;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
}

.content {
  text-align: center;
}

h2 {
  color: #5b3199;
  margin-bottom: 20px;
  font-size: 40px;
  margin-left: 90px;
}

h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 30px;
}

.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.form-group input {
  font-size: 16px;
}

.input-valor {
  font-size: 18px;
  padding: 12px;
}

.opcionais {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 60px;
}

.opcional {
  padding: 10px;
  border: 1px solid #94077f;
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

.btn-next,
.btn-finish {
  margin-left: auto;
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
