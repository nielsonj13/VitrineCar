<template>
  <div>
    <!-- Navbar -->
    <Navbar />
    <div class="container">
      <div class="content">
        <h2>Resultados da sua Busca</h2>
        <p v-if="termo">Exibindo resultados para: <strong>{{ termo }}</strong></p>

        <div class="anuncios-container">
          <!-- Itera sobre os veículos encontrados e exibe os cartões -->
          <div v-for="anuncio in anuncios" :key="anuncio.id" class="card">
            <img
              :src="anuncio.imagem"
              :alt="anuncio.modelo"
              class="img-fluid"
            />

            <!-- Informações do veículo -->
            <div class="car-info">
              <h3>{{ anuncio.marca }} {{ anuncio.modelo }}</h3>
              <p>R$ {{ anuncio.valor }}</p>
              <span>{{ anuncio.anoModelo }}/{{ anuncio.anoFabricacao }}</span>
            </div>
            <div class="card-actions">
              <button class="btn-ver">Ver mais detalhes</button>
            </div>
          </div>
        </div>

        <!-- Mensagem caso não encontre veículos -->
        <div v-if="anuncios.length === 0" class="no-results">
          <p>Nenhum veículo encontrado para "{{ termo }}".</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import DAOService from "@/Services/DAOService";

export default {
  name: "TelaResultados",
  components: {
    Navbar,
  },
  data() {
    return {
      anuncios: [], // Veículos encontrados
      termo: "", // Termo da busca
      daoService: null, // Instância do DAOService
    };
  },
  created() {
    this.termo = this.$route.query.termo || ""; // Obtem o termo de busca da query string
    this.daoService = new DAOService("anuncios"); // Inicializa o DAOService na coleção 'anuncios'
    this.carregarResultados();
  },
  methods: {
    async carregarResultados() {
      try {
        const termoNormalizado = this.termo.trim().toLowerCase(); // Normaliza o termo para evitar problemas de maiúsculas/minúsculas

        // Busca por modelo
        const resultadosModelo = await this.daoService.searchByField("modelo", termoNormalizado);

        // Busca por marca
        const resultadosMarca = await this.daoService.searchByField("marca", termoNormalizado);

        // Combina os resultados e remove duplicatas
        const todosResultados = [...resultadosModelo, ...resultadosMarca];
        this.anuncios = todosResultados.filter(
          (item, index, self) => self.findIndex((v) => v.id === item.id) === index
        );
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
        alert("Erro ao buscar os veículos. Tente novamente.");
      }
    },
  },
};
</script>

<style scoped>
/* Estilo Base */
.container {
  max-width: 80%;
  margin: 0 auto;
  padding: 20px 0;
}

.content {
  text-align: center;
}

h2 {
  color: #5b3199;
  margin-bottom: 20px;
}

.anuncios-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 250px;
  text-align: center;
  padding: 15px;
}

.card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.car-info {
  text-align: left;
}

h3 {
  margin: 10px 0;
  color: #333;
}

.car-info p {
  margin: 0;
  color: #5b3199;
  font-weight: bold;
}

.car-info span {
  font-size: 14px;
  color: #666;
}

.card-actions {
  margin-top: 10px;
}

.card-actions button {
  display: block;
  width: 100%;
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  background-color: #5b3199;
  color: white;
}

.no-results {
  margin-top: 20px;
  padding: 20px;
  border-radius: 10px;
  background-color: #f3f3f3;
  color: #333;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
