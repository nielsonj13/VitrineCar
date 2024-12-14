<template>
  <div>
    <!-- Navbar -->
    <Navbar />
    <div class="container">
      <!-- Conteúdo Principal -->
      <div class="content">
        <h2>Resultados da sua Busca</h2>
        <p v-if="termo">Exibindo resultados para: <strong>{{ termo }}</strong></p>

        <div class="anuncios-container">
          <!-- Itera sobre os veículos encontrados e exibe os cartões -->
          <div v-for="veiculo in veiculos" :key="veiculo.id" class="card">
            <img
              v-if="veiculo.modelo === 'Pulse'"
              src="https://img.olx.com.br/images/57/577487211134112.jpg"
              alt="Fiat Pulse"
              class="img-fluid"
            />
            <img
              v-else-if="veiculo.modelo === 'Macan'"
              src="https://bocamafrapremium.com.br/wp-content/uploads/2024/08/fdccff4b83304f8ba26aed5dc8af3951_1709324197638.jpg"
              alt="Ford Fiesta"
              class="img-fluid"
            />
            <img
              v-else-if="veiculo.modelo === 'Compass'"
              src="https://carroesporteclube.com.br/wp-content/uploads/2021/05/Jeep-Compass-Longitude-2022-foto-Thiago-Ventura-Carro-Esporte-Clube7.jpg"
              alt="Jeep Compass"
              class="img-fluid"
            />
            <img
              v-else-if="veiculo.modelo === 'Celta'"
              src="https://media-repository-mobiauto.storage.googleapis.com/production/images/editorial/magazine/1686762966718.autowp.ru_chevrolet_celta_super_3-door_5.jpg"
              alt="Chevrolet Celta"
              class="img-fluid"
            />
            <img
              v-else-if="veiculo.modelo === 'Gol'"
              src="https://s2-autoesporte.glbimg.com/3EgKP_GD7pf7-BmNtHVJT6qg1HU=/0x0:1400x912/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_cf9d035bf26b4646b105bd958f32089d/internal_photos/bs/2022/R/M/K7kos5QGafxzSGEkFP7Q/dsc06181.jpg"
              alt="Volkswagen Gol"
              class="img-fluid"
            />
            <img
              v-else-if="veiculo.modelo === 'Uno'"
              src="https://img1.icarros.com/dbimg/imgmodelo/4/269_4.jpg"
              alt="Fiat Uno"
              class="img-fluid"
            />

            <!-- Informações do veículo -->
            <div class="car-info">
            <div class="title-container">
              <h3>{{ anuncio.marca }} {{ anuncio.modelo }}</h3>
              <i
                :class="anuncio.favorito ? 'bi bi-star-fill' : 'bi bi-star'"
                class="favorite-icon"
                @click="toggleFavorito(anuncio)"
              ></i>
            </div>
            <p>R$ {{ anuncio.valor }}</p>
            <span>{{ anuncio.anoModelo }}/{{ anuncio.anoFabricacao }}</span>
          </div>
            <div class="card-actions">
              <button class="btn-ver">Ver mais detalhes</button>
            </div>
          </div>
        </div>

        <!-- Mensagem caso não encontre veículos -->
        <div v-if="veiculos.length === 0" class="no-results">
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
      veiculos: [], // Veículos encontrados
      termo: "", // Termo da busca
      daoService: null, // Instância do DAOService
    };
  },
  created() {
    this.termo = this.$route.query.termo || ""; // Obtem o termo de busca da query string
    this.daoService = new DAOService("veiculos"); // Inicializa o DAOService na coleção 'veiculos'
    this.carregarResultados();
  },
  methods: {
    async carregarResultados() {
  try {
    this.veiculos = await this.daoService.getAll(); // Busca todos os veículos
    console.log("Todos os veículos carregados:", this.veiculos); // Verifica no console
  } catch (error) {
    console.error("Erro ao carregar veículos:", error);
    alert("Erro ao carregar os veículos.");
  }
}

  },
};
</script>

<style scoped>
/* Copiado da tela de Meus Anúncios */
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
