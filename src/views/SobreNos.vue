<template>
    <div class="sobre-nos">
      <Navbar />
  
      <!-- Banner -->
      <section class="banner">
        <div class="banner-content">
          <h1>Sobre Nós</h1>
          <p>Conheça a história, missão e valores da VitrineCar</p>
        </div>
      </section>
  
      <!-- Seção de Conteúdo -->
      <div class="container">
        <!-- História -->
        <section class="historia">
          <div class="texto">
            <h2>Nossa História</h2>
            <p>
              A <strong>VitrineCar</strong> nasceu com a missão de conectar vendedores e compradores de veículos de maneira segura, rápida e confiável.
              Nossa plataforma foi desenvolvida para proporcionar uma experiência inovadora e simplificada para todos os usuários.
            </p>
            <p>
                Desde nossa fundação, a <strong>VitrineCar</strong> tem ajudado milhares de pessoas a encontrarem seus veículos ideais.
                Nosso objetivo é oferecer uma plataforma confiável e acessível para a compra e venda de automóveis.
            </p>
            <p>
                Graças à confiança de nossos usuários, já facilitamos a venda de mais de
                <strong>{{ totalVendidos - 1 }}</strong> veículos em todo o Brasil!
            </p>
          </div>

        </section>
  
        <!-- Missão, Visão e Valores -->
        <section class="mvv-container">
          <div class="mvv-card">
            <i class="bi bi-bullseye"></i>
            <h3>Missão</h3>
            <p>Facilitar a compra e venda de veículos de forma segura e eficiente.</p>
          </div>
  
          <div class="mvv-card">
            <i class="bi bi-lightbulb"></i>
            <h3>Visão</h3>
            <p>Ser a maior e mais confiável plataforma de veículos do Brasil.</p>
          </div>
  
          <div class="mvv-card">
            <i class="bi bi-shield-lock"></i>
            <h3>Valores</h3>
            <p>Segurança, transparência, inovação e compromisso com o cliente.</p>
          </div>
        </section>
      </div>
  
      <Footer />
    </div>
  </template>
  
  <script>
  import Navbar from "@/components/NavBar.vue";
  import Footer from "@/components/Footer.vue";
  import { db } from "@/firebase";
  import { collection, getDocs } from "firebase/firestore";
  
  export default {
    name: "SobreNos",
    components: {
      Navbar,
      Footer,
    },
    data() {
    return {
      totalVendidos: 0,
    };
  },
  async created() {
    await this.buscarQuantidadeVendidos();
  },
  methods: {
    async buscarQuantidadeVendidos() {
        try {
        const vendidosRef = collection(db, "veiculos_vendidos");
        const vendidosSnapshot = await getDocs(vendidosRef);
        
        // Atualiza o total com a quantidade de documentos na coleção
        this.totalVendidos = vendidosSnapshot.size;
        } catch (error) {
        console.error("Erro ao buscar quantidade de veículos vendidos:", error);
        }
    }
  },
  };
  </script>
  
  <style scoped>
  /* Estilos gerais */
  .sobre-nos {
    font-family: "Arial", sans-serif;
    color: #333;
  }
  
  /* Banner */
  .banner {
    color: #531B76;
    text-align: center;
    padding: 20px 20px;
  }
  
  .banner-content {
    max-width: 800px;
    margin: auto;
  }
  
  .banner h1 {
    font-size: 42px;
    font-weight: bold;
  }
  
  .banner p {
    font-size: 18px;
    opacity: 0.9;
  }
  
  /* Container principal */
  .container {
    max-width: 1500px;
    margin: 40px auto;
    padding: 0 20px;
  }

  strong{
    color: #531B76;
  }
  
  /* Seção História */
  .historia {
    display: flex;
    align-items: center;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    gap: 30px;
  }
  
  .texto {
    flex: 1;
  }
  
  .texto h2 {
    color: #531B76;
    margin-bottom: 15px;
  }
  
  .texto p {
    font-size: 18px;
    color: #555;
  }
  
  .imagem-historia {
    width: 50%;
    border-radius: 10px;
  }
  
  /* Missão, Visão e Valores */
  .mvv-container {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    gap: 20px;
  }
  
  .mvv-card {
    flex: 1;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s ease-in-out;
  }
  
  .mvv-card:hover {
    transform: scale(1.05);
  }
  
  .mvv-card i {
    font-size: 40px;
    color: #531B76;
    margin-bottom: 10px;
  }
  
  .mvv-card h3 {
    color: #531B76;
    margin-bottom: 10px;
    font-size: 22px;
  }
  
  .mvv-card p {
    font-size: 16px;
    color: #555;
  }
  
  /* Responsividade */
  @media (max-width: 768px) {
    .banner h1 {
      font-size: 32px;
    }
  
    .banner p {
      font-size: 16px;
    }
  
    .container {
      padding: 0 15px;
    }
  
    .historia {
      flex-direction: column;
      text-align: center;
      padding: 20px;
    }
  
    .imagem-historia {
      width: 90%;
    }
  
    .mvv-container {
      flex-direction: column;
    }
  }
  </style>
  