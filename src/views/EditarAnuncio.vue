<template>
  <Navbar />
  <h2>Editar Anúncio</h2>
  <div class="container">
    <div v-if="etapa === 1" class="content">
      <h3>Atualize as informações do veículo</h3>
      <div class="form">
        <div class="form-group">
          <label for="tipoVeiculo">Tipo de Veículo:</label>
          <select v-model="tipoVeiculo" @change="carregarMarcas">
            <option value="carros">Carro</option>
            <option value="motos">Moto</option>
            <option value="caminhoes">Caminhão</option>
          </select>
        </div>

        <div class="form-group">
          <label for="marca">Marca:</label>
          <select v-model="anuncio.marca" @change="carregarModelos">
            <option value="" disabled selected>Selecione a marca</option>
            <option v-for="marca in marcas" :key="marca.codigo" :value="marca.codigo">
              {{ marca.nome }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="modelo">Modelo:</label>
          <select v-model="anuncio.modelo">
            <option value="" disabled selected>Selecione o modelo</option>
            <option v-for="modelo in modelos" :key="modelo.codigo" :value="modelo.nome">
              {{ modelo.nome }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Ano do Modelo</label>
          <input type="text" v-model="anuncio.anoModelo" placeholder="Digite o ano do modelo" @input="validateNumberInput('anoModelo'), validarAno('anoModelo')" />
        </div>
        <div class="form-group">
          <label>Ano de Fabricação</label>
          <input type="text" v-model="anuncio.anoFabricacao" placeholder="Digite o ano de fabricação" @input="validateNumberInput('anoFabricacao'), validarAno('anoFabricacao')" />
        </div>
        <div class="form-group">
          <label>Quilometragem (km)</label>
          <input type="text" v-model="anuncio.km" placeholder="Digite a quilometragem"  @input="formatarKm" />
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
          <input type="text" v-model="anuncio.valor" placeholder="Digite o valor do veículo"
          class="input-valor" @input="formatarValor" />
        </div>
        <div class="form-group">
          <label>Descrição</label>
          <textarea v-model="anuncio.descricao" placeholder="Edite a descrição do veículo..." rows="4"></textarea>
        </div>
      </div>
      <div class="actions">
        <button class="btn-next" @click="avancarEtapa">Próximo</button>
      </div>
    </div>

    <div v-else-if="etapa === 2" class="content">
      <h3>Atualize os opcionais do veículo</h3>
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
        <!-- Loop para exibir os campos de imagens -->
        <div class="form-group" v-for="(imagem, index) in anuncio.imagens" :key="index">
          <label>Link da Imagem {{ index + 1 }}</label>
          <div class="input-container">
            <input type="text" v-model="anuncio.imagens[index]" placeholder="Insira o link da imagem" />
            
            <!-- Ícone de Remover dentro do Input -->
            <button v-if="index > 2" @click="removerImagem(index)" class="remove-btn" title="Remover imagem">
              <i class="bi bi-x-circle-fill"></i>
            </button>
          </div>
        </div>

        <!-- Botão para adicionar mais imagens -->
        <button type="button" class="btn-adicionar" @click="adicionarImagem" :disabled="anuncio.imagens.length >= 10"> + Adicionar Imagem</button>
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
import { getAuth } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import axios from "axios"; 

export default {
  name: "EditarAnuncio",
  components: {
    Navbar,
  },
  data() {
    return {
      etapa: 1,
      anuncio: {
        tipoVeiculo: "carros",  // 'carros', 'motos', 'caminhoes'
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
      marcas: [],  // Armazena as marcas da API FIPE
      modelos: [],  // Armazena os modelos da API FIPE
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
    this.carregarMarcas();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      this.$router.push("/login");  // Redireciona se não estiver logado
    } else {
      this.anuncio.userId = user.uid;  // Vincula o anúncio ao usuário logado
    }
    
    // Carrega o anúncio a ser editado
    this.carregarAnuncio();
  },
  methods: {

    adicionarImagem() {
      this.anuncio.imagens.push("");
    },
    removerImagem(index) {
      this.anuncio.imagens.splice(index, 1);
    },

    async carregarMarcas() {
    try {
      const response = await axios.get(
        `https://parallelum.com.br/fipe/api/v1/${this.tipoVeiculo}/marcas`
      );
      this.marcas = response.data;
    } catch (error) {
      console.error("Erro ao carregar marcas:", error);
    }
    },

    async carregarModelos() {
      if (!this.anuncio.marca) return;
      try {
        const response = await axios.get(
          `https://parallelum.com.br/fipe/api/v1/${this.tipoVeiculo}/marcas/${this.anuncio.marca}/modelos`
        );
        this.modelos = response.data.modelos;
      } catch (error) {
        console.error("Erro ao carregar modelos:", error);
      }
    },


    validateNumberInput(field) {
      this.anuncio[field] = this.anuncio[field].replace(/\D/g, '');
    },

    formatarValor() {
    if (this.anuncio.valor) {
      let numeroLimpo = this.anuncio.valor.replace(/\D/g, "");

      if (!numeroLimpo) {
        this.anuncio.valor = "";
        return;
      }

      const valorFormatado = new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(numeroLimpo) / 100);

      this.anuncio.valor = valorFormatado;
    }
    },

    validarAno(campo) {
    // Remove qualquer caractere que não seja número
    this.anuncio[campo] = this.anuncio[campo].replace(/\D/g, '');

    // Limita a entrada para no máximo 4 dígitos
    if (this.anuncio[campo].length > 4) {
      this.anuncio[campo] = this.anuncio[campo].slice(0, 4);
    }
  },
  formatarKm() {
  // Remove qualquer caractere que não seja número
  const numeroLimpo = this.anuncio.km.replace(/\D/g, "");

  // Se o campo estiver vazio, define como string vazia
  if (!numeroLimpo) {
    this.anuncio.km = "";
    return;
  }

  // Formata o número com separadores de milhar
  const kmFormatado = new Intl.NumberFormat("pt-BR").format(parseInt(numeroLimpo));
  this.anuncio.km = kmFormatado;
},

avancarEtapa() {
  if (this.etapa === 1) {
    // Validação do ano antes de avançar
    const anoAtual = new Date().getFullYear();
    const anoFabricacao = parseInt(this.anuncio.anoFabricacao);
    const anoModelo = parseInt(this.anuncio.anoModelo);

    if (isNaN(anoFabricacao) || anoFabricacao > anoAtual) {
      alert("Ano de fabricação inválido. O ano de fabricação não pode ser maior que o ano atual.");
      return;
    }

    if (isNaN(anoModelo) || anoModelo < anoFabricacao || anoModelo > anoFabricacao + 1) {
      alert("O ano do modelo deve ser igual ou no máximo 1 ano a mais que o ano de fabricação.");
      return;
    }
  }

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

    async carregarAnuncio() {
      const id = this.$route.params.id;
      try {
        const anuncioData = await this.daoService.get(id);
        // Normalizar os campos carregados (se necessário)
        this.anuncio = {
          ...anuncioData,
          marca: anuncioData.marca.trim().toLowerCase(), // ou .toUpperCase()
          modelo: anuncioData.modelo.trim().toLowerCase(), // ou .toUpperCase()
        };
      } catch (error) {
        console.error("Erro ao carregar anúncio:", error);
        alert("Erro ao carregar anúncio.");
      }
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
    formatarModelo(modelo) {
      if (!modelo) return "";
      return modelo.split(" ").slice(0, 2).join(" "); // Pega os dois primeiros nomes
    },

  async salvarEdicao() {
      try {
        // Verifica se todos os campos obrigatórios estão preenchidos
        if (!this.anuncio.valor) {
          alert("Por favor, preencha todos os campos obrigatórios.");
          return;
        }
        if (!this.anuncio.userId) {
          alert("Você precisa estar logado para editar um anúncio.");
          return;
        }

        // Buscar o anúncio original antes da edição
        const anuncioOriginal = await this.daoService.get(this.anuncio.id);

        // Se a marca não foi alterada, mantém a original
        if (!this.anuncio.marca) {
          this.anuncio.marca = anuncioOriginal.marca;
        } else {
          this.anuncio.marca = this.marcas.find(m => m.codigo === this.anuncio.marca)?.nome || anuncioOriginal.marca;
        }

        // Se o modelo não foi alterado, mantém o original
        if (!this.anuncio.modelo) {
          this.anuncio.modelo = anuncioOriginal.modelo;
        } else {
          this.anuncio.modelo = this.formatarModelo(this.anuncio.modelo);
        }

        // Normalizar os campos antes de salvar
        this.anuncio.marca = this.anuncio.marca.trim().toLowerCase(); 
        this.anuncio.modelo = this.anuncio.modelo.trim().toLowerCase();
        this.anuncio.categoria = this.anuncio.categoria.trim().toLowerCase();

        await this.daoService.update(this.anuncio.id, this.anuncio);
        alert("Anúncio editado com sucesso!");
        console.log(this.anuncio);

        this.$router.push("/TelaMeusAnuncios"); // Redireciona para a tela "Meus Anúncios"

        this.resetarFormulario();
      } catch (error) {
        console.error("Erro ao salvar as alterações:", error);
        alert("Erro ao editar o anúncio. Verifique os logs.");
      }
  },

  resetarFormulario() {
    this.etapa = 1;
    this.anuncio = {
      id: null,
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
.form-group select,
.form-group  textarea{
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
  margin-top: 20px;
  padding: 10px;
}

.btn-adicionar {
  background-color: #531B76;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-container input {
  width: 100%;
  padding-right: 35px; /* Espaço extra para o ícone */
  box-sizing: border-box;
}

.remove-btn {
  position: absolute;
  right: 10px;  /* Posicionamento à direita do input */
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  transition: transform 0.2s, color 0.3s ease;
}

.remove-btn i {
  color: #ff4d4d; /* Vermelho suave */
  font-size: 20px;
}

.remove-btn:hover i {
  color: #d11a2a; /* Tom mais escuro no hover */
  transform: scale(1.2); /* Efeito de zoom */
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

/* Responsividade */
@media (max-width: 600px) {
  .container {
    width: 90%;
  }

  .form {
    grid-template-columns: 1fr;
  }
}
</style>
