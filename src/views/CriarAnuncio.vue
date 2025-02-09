<template>
  <Navbar />
  <h2>Criar Anúncio</h2>
  <div class="container">
    <div v-if="etapa === 1" class="content">
      <h3>Preencha as informações do veículo</h3>
      <div class="form">
        <div class="form-group">
          <label for="tipoVeiculo">Tipo de Veículo:</label>
          <select v-model="tipoVeiculo" @change="atualizarTipoVeiculo">
            <option value="" disabled>Selecione o tipo de veículo</option>
            <option value="carros">Carro</option>
            <option value="motos">Moto</option>
          </select>
        </div>
        <div class="form-group">
          <label for="marca">Marca:</label>
          <select v-model="anuncio.marca">
            <option value="" disabled>Selecione uma marca</option>
            <option v-for="marca in marcas" :key="marca.codigo" :value="marca.codigo">
              {{ marca.nome }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="modelo">Modelo:</label>
          <select v-model="anuncio.modelo">
            <option value="" disabled>Selecione um modelo</option>
            <option v-for="modelo in modelos" :key="modelo.codigo" :value="modelo.nome">
              {{ modelo.nome }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Ano do Modelo</label>
          <input type="text" v-model="anuncio.anoModelo" placeholder="Digite o ano do modelo" @input="validarAno('anoModelo')"  />
        </div>
        <div class="form-group">
          <label>Ano de Fabricação</label>
          <input type="text" v-model="anuncio.anoFabricacao" placeholder="Digite o ano de fabricação" @input="validarAno('anoFabricacao')" />
        </div>
        <div class="form-group">
          <label>Quilometragem (km)</label>
          <input type="text" v-model="anuncio.km" placeholder="Digite a quilometragem" @input="formatarKm"/>
        </div>
        <div class="form-group">
          <label>Cor</label>
          <select v-model="anuncio.cor">
            <option value="">Escolha uma cor</option>
            <option>Amarelo</option>
            <option>Azul</option>
            <option>Bege</option>
            <option>Branco</option>
            <option>Cinza</option>
            <option>Dourado</option>
            <option>Grená</option>
            <option>Laranja</option>
            <option>Marrom</option>
            <option>Prata</option>
            <option>Preto</option>
            <option>Rosa</option>
            <option>Roxo</option>
            <option>Verde</option>
            <option>Vermelho</option>
            <option>Fantasia</option>
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
            <option>Esportivo</option>
            <option>MiniVan</option>
            <option>Moto</option>
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
          <input type="text" v-model="anuncio.valor" placeholder="Digite o valor do veículo" class="input-valor" @input="formatarValor"/>
        </div>
        <div class="form-group">
          <label>Descrição</label>
          <textarea v-model="anuncio.descricao" placeholder="Descreva detalhes sobre o veículo..." rows="4"></textarea>
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
        <button type="button" class="btn-adicionar" @click="adicionarImagem" :disabled="anuncio.imagens.length >= 10">+ Adicionar Imagem</button>
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
import axios from "axios";

export default {
  name: "CriarAnuncio",
  components: {
    Navbar,
  },
  data() {
    return {
      etapa: 1,
      anuncio: {
        tipoVeiculo: "carros",
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
      marcas: [],
      modelos: [],
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
    this.daoService = new DAOService("anuncios");
    this.carregarMarcas();
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      this.$router.push("/login");
    } else {
      this.anuncio.userId = user.uid;
    }
  },
  watch: {
    // Sempre que o tipo de veículo mudar, redefinir marca e modelo
    "tipoVeiculo"() {
      this.anuncio.marca = ""; // Resetar marca
      this.modelos = []; // Limpar os modelos disponíveis
      this.anuncio.modelo = ""; // Resetar modelo
      this.carregarMarcas(); // Atualiza as marcas conforme o novo tipo
    },

    // Sempre que a marca mudar, redefinir o modelo
    "anuncio.marca"() {
      this.anuncio.modelo = ""; // Resetar modelo ao mudar a marca
      this.modelos = []; // Limpar os modelos disponíveis
      this.carregarModelos(); // Atualiza os modelos conforme a nova marca
    }
  },
  methods: {
    adicionarImagem() {
      if (this.anuncio.imagens.length < 10) {
        this.anuncio.imagens.push("");
      }
    },

    removerImagem(index) {
      this.anuncio.imagens.splice(index, 1); // Remove o campo de imagem
    },

    atualizarTipoVeiculo() {
      this.anuncio.marca = ""; // Resetar a marca
      this.anuncio.modelo = ""; // Resetar o modelo
      this.modelos = []; // Limpar os modelos disponíveis
      this.carregarMarcas(); // Agora ele chama corretamente a função de carregar marcas
    },

    async carregarMarcas() {
      try {
        if (!this.tipoVeiculo) return;

        const response = await axios.get(
          `https://parallelum.com.br/fipe/api/v1/${this.tipoVeiculo}/marcas`
        );

        this.marcas = response.data; // Atualiza a lista de marcas
      } catch (error) {
        console.error("Erro ao carregar marcas:", error);
      }
    },

    async carregarModelos() {
      try {
        if (!this.anuncio.marca) return;

        const response = await axios.get(
          `https://parallelum.com.br/fipe/api/v1/${this.tipoVeiculo}/marcas/${this.anuncio.marca}/modelos`
        );

        this.modelos = response.data.modelos;
      } catch (error) {
        console.error("Erro ao carregar modelos:", error);
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
    formatarValor() {
      if (this.anuncio.valor) {
        // Remove caracteres não numéricos
        let numeroLimpo = this.anuncio.valor.replace(/\D/g, "");

        // Se não houver número, define o campo como vazio
        if (!numeroLimpo) {
          this.anuncio.valor = "";
          return;
        }

        // Divide por 100 para obter valores corretos e formata sem "R$"
        const valorFormatado = new Intl.NumberFormat("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(parseFloat(numeroLimpo) / 100);

        // Atualiza o campo sem adicionar "R$"
        this.anuncio.valor = valorFormatado;
      }
    },
    formatarKm() {
      if (!this.anuncio.km) {
        this.anuncio.km = ""; // Se estiver vazio, mantém vazio
        return;
      }

      // Remove caracteres não numéricos
      let numeroLimpo = this.anuncio.km.replace(/\D/g, "");

      // Se não houver número válido, define o campo como vazio
      if (!numeroLimpo) {
        this.anuncio.km = "";
        return;
      }

      // Formata o número corretamente
      this.anuncio.km = new Intl.NumberFormat("pt-BR").format(parseInt(numeroLimpo, 10));
    },

    avancarEtapa() {
      if (this.etapa === 1) {
        // Validação do ano antes de avançar
        const anoMinimo = 1886;
        const anoAtual = new Date().getFullYear();
        const anoFabricacao = parseInt(this.anuncio.anoFabricacao);
        const anoModelo = parseInt(this.anuncio.anoModelo);

        if (!this.anuncio.marca || !this.anuncio.modelo || !this.anuncio.valor || !this.anuncio.anoModelo || !this.anuncio.anoFabricacao) {
          alert("Por favor, preencha todos os campos obrigatórios.");
          return;
        }

        if (isNaN(anoFabricacao) || anoFabricacao < anoMinimo || anoFabricacao > anoAtual) {
          alert(`Ano de fabricação inválido. O ano de fabricação do modelo deve estar entre ${anoMinimo} e ${anoAtual}.`);
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
    formatarModelo(modelo) {
      if (!modelo) return "";
      return modelo.split(" ").slice(0, 2).join(" "); // Pega os dois primeiros nomes
    },
    async finalizarAnuncio() {
      try {
        
        if (!this.anuncio.userId) {
          alert("Você precisa estar logado para criar um anúncio.");
          return;
        }
        
        this.anuncio.modelo = this.formatarModelo(this.anuncio.modelo);
        this.anuncio.marca = this.marcas.find(m => m.codigo === this.anuncio.marca)?.nome || "";
        this.anuncio.marca = this.anuncio.marca.trim().toLowerCase(); 
        this.anuncio.modelo = this.anuncio.modelo.trim().toLowerCase();
        this.anuncio.categoria = this.anuncio.categoria.trim().toLowerCase();


        const id = await this.daoService.insert(this.anuncio);
        alert(`Anúncio finalizado com sucesso! ID: ${id}`);
        this.$router.push("/TelaMeusAnuncios");
      } catch (error) {
        console.error("Erro ao salvar o anúncio:", error);
        alert("Erro ao finalizar o anúncio. Verifique os logs.");
      }
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
.form-group  textarea {
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
