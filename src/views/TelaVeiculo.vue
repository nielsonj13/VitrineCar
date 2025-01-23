<template>
  <div>
    <Navbar />
    <div class="container" v-if="veiculo">
      <div class="image-gallery">
        <img v-for="(image, index) in veiculo.imagens" :key="index" :src="image" alt="Carro" class="img-fluid" />
      </div>

      <div class="vehicle-info">
        <div class="info-section">
          <div class="price-title">
            <h1 class="vehicle-title">{{ veiculo.marca }} {{ veiculo.modelo }}</h1>
            <p class="vehicle-price">R$ {{ veiculo.valor }}</p>
            <i 
              :class="veiculo.favorito ? 'bi bi-star-fill' : 'bi bi-star'" 
              class="favorite-icon" 
              @click="toggleFavorito(veiculo)"
            ></i>
          </div>
          <p class="subtitle">{{ veiculo.descricao }}</p>
          <div class="info-grid">
            <p><i class="bi bi-calendar"></i> <strong>Ano:</strong> {{ veiculo.anoModelo }}/{{ veiculo.anoFabricacao }}</p>
            <p><i class="bi bi-palette"></i> <strong>Cor:</strong> {{ veiculo.cor }}</p>
            <p><i class="bi bi-speedometer2"></i> <strong>Km Rodado:</strong> {{ veiculo.km }}</p>
            <p><i class="bi bi-gear"></i> <strong>Câmbio:</strong> {{ veiculo.cambio }}</p>
            <p><i class="bi bi-fuel-pump"></i> <strong>Combustível:</strong> {{ veiculo.combustivel }}</p>
            <p><i class="bi bi-gear"></i><strong>Categoria:</strong> {{ veiculo.categoria }}</p>
          </div>
          <p class="options"><strong>Opcionais:</strong> {{ veiculo.opcionais?.join(', ') }}</p>
        </div>

        <!-- <div class="info-section">
          <h3>Informações do Vendedor</h3>
          <div class="seller-details">
            <p class="seller-name"><i class="bi bi-person-circle"></i> {{ veiculo.vendedor.nome }}</p>
            <p class="seller-contact"><i class="bi bi-telephone"></i> {{ veiculo.vendedor.contato }}</p>
            <p class="seller-location"><i class="bi bi-geo-alt"></i> {{ veiculo.vendedor.localizacao }}</p>
          </div>
        </div> -->
      </div>
    </div>
    <div v-else>
      <p class="loading">Carregando veículo...</p>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/NavBar.vue';
import DAOService from '@/Services/DAOService';
import FavoritosService from '@/Services/FavoritosService';

export default {
  name: 'TelaVeiculo',
  components: {
    Navbar,
  },
  data() {
    return {
      veiculo: null,
      daoService: new DAOService('anuncios'),
    };
  },
  async created() {
    await this.carregarVeiculo();
  },
  methods: {
    async carregarVeiculo() {
      try {
        const id = this.$route.params.id;
        console.log("ID do veículo recebido:", id);

        if (!id) {
          alert("ID do veículo não fornecido.");
          return;
        }

        const veiculoData = await this.daoService.get(id);

        if (veiculoData) {
          console.log("Dados do veículo carregados:", veiculoData);
          this.veiculo = veiculoData;
        } else {
          alert("Veículo não encontrado.");
        }
      } catch (error) {
        console.error('Erro ao carregar veículo:', error);
        alert('Erro ao carregar veículo.');
      }
    },
    
    async toggleFavorito(veiculo) {
      veiculo.favorito = !veiculo.favorito;
      if (veiculo.favorito) {
        FavoritosService.adicionarFavorito(veiculo);
      } else {
        FavoritosService.removerFavorito(veiculo.id);
      }

      // Atualiza no banco de dados (Firebase)
      try {
        await this.daoService.update(veiculo.id, { favorito: veiculo.favorito });
      } catch (error) {
        console.error("Erro ao atualizar favorito:", error);
        alert("Erro ao atualizar o favorito.");
      }
    }
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
.image-gallery {
  display: flex;
  gap: 15px;
  justify-content: center;
}
.img-fluid {
  max-width: 300px;
  border-radius: 10px;
}
.vehicle-info {
  display: flex;
  justify-content: space-between;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  margin-top: 20px;
}
.info-section {
  flex: 1;
  padding: 20px;
}
.price-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.vehicle-title {
  font-size: 36px;
  font-weight: bold;
  color: #5b3199;
}
.vehicle-price {
  font-size: 40px;
  font-weight: bold;
  color: #5b3199;
}
.favorite-icon {
  cursor: pointer;
  font-size: 30px;
  color: #ddd;
  transition: transform 0.3s ease;
}
.favorite-icon.bi-star-fill {
  color: #5b3199;
}
.favorite-icon:hover {
  transform: scale(1.2);
}
.subtitle {
  font-size: 18px;
  color: #333;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  color: #333;
  font-size: 16px;
}
.options {
  margin-top: 15px;
  font-size: 16px;
  color: #333;
}
.seller-name {
  font-size: 22px;
  font-weight: bold;
  color: #5b3199;
}
.seller-contact, .seller-location {
  font-size: 16px;
  color: #555;
}
.loading {
  text-align: center;
  font-size: 24px;
  color: #5b3199;
  margin-top: 50px;
}
</style>
