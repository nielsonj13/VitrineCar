<template>
    <Navbar />
    <h2>Editar Anúncio</h2>
    <div class="container">
      <!-- Etapa 1: Preenchendo informações do veículo -->
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
            <input type="text" v-model="anuncio.anoModelo" placeholder="Digite o ano do modelo" />
          </div>
          <div class="form-group">
            <label>Ano de Fabricação</label>
            <input type="text" v-model="anuncio.anoFabricacao" placeholder="Digite o ano de fabricação" />
          </div>
          <div class="form-group">
            <label>Quilometragem (km)</label>
            <input type="text" v-model="anuncio.km" placeholder="Digite a quilometragem" />
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
          <div class="form-group">
            <label>Valor</label>
            <input type="text" v-model="anuncio.valor" placeholder="Digite o valor do veículo" class="input-valor" />
          </div>
        </div>
        <div class="actions">
          <button class="btn-next" @click="avancarEtapa">Próximo</button>
        </div>
      </div>
  
      <!-- Etapa 2: Seleção de opcionais -->
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
  
      <!-- Etapa 3: Upload de imagens -->
      <div v-else-if="etapa === 3" class="content">
        <h3>Adicionar fotos do veículo</h3>
        <div class="upload-box">
          <label for="upload" class="upload-label">
            <span>Upload de imagens</span>
            <input type="file" id="upload" class="upload-input" @change="uploadImagens" multiple />
          </label>
        </div>
        <div class="actions">
          <button class="btn-back" @click="voltarEtapa">Voltar</button>
          <button class="btn-finish" @click="salvarEdicao">Salvar Alterações</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from "../components/NavBar.vue";
  import DAOService from "@/Services/DAOService";
  import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
  import { storage } from "../firebase"; // Importa o Firebase Storage
  
  export default {
    name: "EditarAnuncio",
    components: {
      Navbar,
    },
    data() {
      return {
        etapa: 1,
        anuncio: {
          id: null,  // ID do anúncio a ser editado
          marca: "",
          modelo: "",
          anoModelo: "",
          anoFabricacao: "",
          km: "",
          valor: "",
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
        daoService: null, // Instância do DAOService
      };
    },
    created() {
      // Inicializa a instância do DAOService
      this.daoService = new DAOService("anuncios");
      
      // Carrega o anúncio a ser editado
      this.carregarAnuncio();
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
  
      // Carregar os dados do anúncio a ser editado
      async carregarAnuncio() {
        const id = this.$route.params.id; // Supondo que o ID do anúncio seja passado pela rota
        try {
          const anuncioData = await this.daoService.get(id);
          this.anuncio = anuncioData;
        } catch (error) {
          console.error("Erro ao carregar anúncio:", error);
          alert("Erro ao carregar anúncio.");
        }
      },
  
      // Atualizar imagens para o Firebase
      async uploadImagens(event) {
        const files = event.target.files;
        const promises = [];
  
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
  
          // Cria uma referência ao arquivo no Firebase Storage
          const storageRef = ref(storage, `images/${file.name}`);
  
          // Faz o upload do arquivo
          const uploadTask = uploadBytesResumable(storageRef, file);
  
          promises.push(
            new Promise((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  // Aqui você pode mostrar o progresso do upload se quiser
                },
                (error) => reject(error),
                async () => {
                  // Após o upload, obtenha a URL de download
                  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                  this.anuncio.imagens.push(downloadURL); // Salva a URL da imagem no anúncio
                  resolve();
                }
              );
            })
          );
        }
  
        // Aguarda que todos os arquivos sejam carregados
        await Promise.all(promises);
        console.log("Imagens carregadas:", this.anuncio.imagens);
      },
  
      // Salvar as alterações do anúncio
      async salvarEdicao() {
        try {
          // Verifica se todos os campos obrigatórios estão preenchidos
          if (!this.anuncio.marca || !this.anuncio.modelo || !this.anuncio.valor) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
          }
  
          // Atualiza o anúncio no Firestore
          await this.daoService.update(this.anuncio.id, this.anuncio);
          alert("Anúncio editado com sucesso!");
          console.log(this.anuncio);
  
          // Resetar o formulário após a edição
          this.resetarFormulario();
        } catch (error) {
          console.error("Erro ao salvar as alterações:", error);
          alert("Erro ao editar o anúncio. Verifique os logs.");
        }
      },
  
      // Resetar os dados do formulário
      resetarFormulario() {
        this.etapa = 1;
        this.anuncio = {
          id: null, // Limpa o ID após salvar
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
  /* Seu CSS original fornecido */
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
  