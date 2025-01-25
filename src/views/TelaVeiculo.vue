<template>
  <div>
    <Navbar />
    <div class="container" v-if="veiculo">
      <div class="image-gallery">
        <img 
          v-for="(imagem, index) in veiculo.imagens" 
          :key="index" 
          :src="imagem" 
          alt="Imagem do veículo" 
          class="img-fluid" 
          @error="imagemErro(index)"
        />
      </div>

      <div class="vehicle-info">
        <div class="price-title">
          <h1 class="vehicle-title">{{ veiculo.marca }} {{ veiculo.modelo }}</h1>
          <p class="vehicle-price">R$ {{ veiculo.valor }}</p>
          <i 
            :class="veiculo.favorito ? 'bi bi-star-fill' : 'bi bi-star'" 
            class="favorite-icon" 
            @click="toggleFavorito(veiculo)"
          ></i>
        </div>

        <div class="info-wrapper">
          <!-- Informações do veículo -->
          <div class="info-section">
            <h4>Informações do Veículo</h4>
            <div class="info-grid">
              <p><i class="bi bi-calendar"></i> <strong>Ano:</strong> {{ veiculo.anoModelo }}/{{ veiculo.anoFabricacao }}</p>
              <p><i class="bi bi-palette"></i> <strong>Cor:</strong> {{ veiculo.cor }}</p>
              <p><i class="bi bi-speedometer2"></i> <strong>Km Rodado:</strong> {{ veiculo.km }}</p>
              <p><i class="bi bi-gear"></i> <strong>Câmbio:</strong> {{ veiculo.cambio }}</p>
              <p><i class="bi bi-fuel-pump"></i> <strong>Combustível:</strong> {{ veiculo.combustivel }}</p>
              <p><i class="bi bi-car-front"></i><strong> Categoria:</strong> {{ veiculo.categoria }}</p>
            </div>
            <p class="options"><strong>Opcionais:</strong> {{ veiculo.opcionais?.join(', ') }}</p>
          </div>

          <!-- Informações do Vendedor -->
          <div class="info-section seller-details" v-if="vendedor">
            <h4>Informações do Vendedor</h4>
            <p class="seller-name"><i class="bi bi-person-circle"></i> <strong>Nome:</strong> {{ vendedor.nome }} {{ vendedor.sobrenome }}</p>
            <p><i class="bi bi-envelope"></i> <strong>Email:</strong> {{ vendedor.email }}</p>
            <p><i class="bi bi-telephone"></i> <strong>Telefone:</strong> {{ vendedor.telefone }}</p>
            <p><i class="bi bi-geo-alt"></i> <strong>Localização:</strong> {{ vendedor.cidade }}, {{ vendedor.estado }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="loading">Carregando veículo...</p>
    </div>
  </div>
</template>

<script>
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
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
      vendedor: null,
      daoService: new DAOService('anuncios'),
    };
  },
  async created() {
    await this.carregarVeiculo();
  },
  methods: {
    imagemErro(index) {
      this.veiculo.imagens[index] = "https://via.placeholder.com/300?text=Imagem+Não+Disponível";
    },
    async carregarVeiculo() {
      try {
        const id = this.$route.params.id;
        if (!id) {
          alert("ID do veículo não fornecido.");
          return;
        }
        const veiculoData = await this.daoService.get(id);

        if (veiculoData) {
          this.veiculo = veiculoData;
          await this.carregarVendedor(veiculoData.userId);
        } else {
          alert("Veículo não encontrado.");
        }
      } catch (error) {
        console.error('Erro ao carregar veículo:', error);
        alert('Erro ao carregar veículo.');
      }
    },

    async carregarVendedor(userId) {
      try {
        const userRef = doc(db, 'usuarios', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          this.vendedor = {
            nome: userData.nome || "Não informado",
            sobrenome: userData.sobrenome || "Não informado",
            email: userData.contato?.email || "Não informado",
            telefone: userData.contato?.telefone || "Não informado",
            cidade: userData.endereco?.cidade || "Não informado",
            estado: userData.endereco?.estado || "Não informado",
          };
        }
      } catch (error) {
        console.error('Erro ao buscar informações do vendedor:', error);
      }
    },

    async toggleFavorito(anuncio) {
      if (!FavoritosService.getUsuarioLogado()) {
        alert("Você precisa estar logado para favoritar um anúncio.");
        return;
      }

      try {
        const isFavorito = await FavoritosService.isFavorito(anuncio.id);
        
        if (isFavorito) {
          await FavoritosService.removerFavorito(anuncio.id);
          anuncio.favorito = false;
        } else {
          await FavoritosService.adicionarFavorito(anuncio);
          anuncio.favorito = true;
        }

        await this.daoService.update(anuncio.id, { favorito: anuncio.favorito });

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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.image-gallery {
  display: flex;
  gap: 50px;
  justify-content: center;
  margin-bottom: 10px;
}

.img-fluid {
  max-width: 300px;
  border-radius: 15px;
}

.vehicle-info {
  display: flex;
  flex-direction: column;
  background: #fdf9f9;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  gap: 10px;
}

.info-wrapper {
  display: flex;
  gap: 40px;
}

.info-section {
  flex: 1;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
}

.price-title {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Alinha os elementos à esquerda */
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
  margin-left: 600px; /* Move o preço para próximo da estrela */
}

.favorite-icon {
  cursor: pointer;
  font-size: 35px;
  color: #ccc;
  transition: all 0.3s ease-in-out;
  margin-left: 25px;
  vertical-align: middle;
  position: relative;
  top: -9px;
}

.favorite-icon.bi-star-fill {
  color: #5b3199;
}

.favorite-icon:hover {
  transform: scale(1.2);
  color: #7c42c2;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.loading {
  text-align: center;
  font-size: 24px;
  color: #5b3199;
  margin-top: 50px;
}

.seller-name {
  font-size: 30px; /* Ajuste conforme necessário */
  font-weight: bold;
  color: #5b3199;
}


i {
  color: #5b3199; /* Altere para a cor desejada */
}
</style>
