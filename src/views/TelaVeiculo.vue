<template>
    <div>
      <!-- Navbar -->
      <div class="navbar">
        <img src="/public/logos/logo_vitrinecar.png" alt="VitrineCar" />
        <nav>
          <a href="#">Comprar</a>
          <a href="#">Vender</a>
          <a href="#">Favoritos</a>
        </nav>
        <a href="TelaLogin.html" class="login-button">Entrar</a>
      </div>
  
      <!-- Conteúdo principal -->
      <div class="container">
        <!-- Galeria de imagens do veículo -->
        <div class="image-gallery">
          <img src="https://img.olx.com.br/images/57/577487211134112.jpg" alt="Carro 1" />
          <img src="https://img.olx.com.br/images/56/569487339479298.jpg" alt="Carro 2" />
          <img src="https://img.olx.com.br/images/57/573415212311589.jpg" alt="Carro 3" />
        </div>
  
        <!-- Detalhes do veículo e informações do vendedor -->
        <div class="vehicle-info">
          <div class="vehicle-details">
            <h2>Fiat Pulse</h2>
            <p>1.0 12V SCE FLEX OUTSIDER MANUAL</p>
            <p><strong>Informações do Veículo:</strong></p>
            <p><strong>Ano:</strong> 2023/2024</p>
            <p><strong>Cor:</strong> Preto</p>
            <p><strong>Km Rodado:</strong> 27.789</p>
            <p><strong>Câmbio:</strong> Manual</p>
            <p><strong>Combustível:</strong> Flex</p>
            <p>
              <strong>Opcionais do Veículo:</strong> Airbag, Alarme, Ar quente,
              Computador de bordo, Controle de tração, Desembaçador traseiro, Ar
              condicionado, Encosto de cabeça
            </p>
            <p class="vehicle-price">R$ 99.000 <span class="icon-star">★</span></p>
          </div>
          <!-- Informações do vendedor -->
          <div class="seller-info">
            <h3>Informações do Vendedor:</h3>
            <div class="seller-contact">
              <span class="contact-icon">👤</span>
              <p>Flavio Guilherme</p>
            </div>
            <div class="seller-contact">
              <span class="contact-icon">📞</span>
              <p>(81) 9 9999-9999 / (82) 9 9999-9999</p>
            </div>
            <div class="seller-contact">
              <span class="contact-icon">📍</span>
              <p>Palmares-PE</p>
            </div>
          </div>
        </div>
  
        <!-- Link para o rodapé -->
        <div class="footer-link">
          <p><a href="#">Retornar para página inicial</a></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from '../components/NavBar.vue';
  
  export default {
    name: 'BuscarVeiculo',
    components: {
      Navbar,
    },
  };
  </script>
  
  <style scoped>
  /* Estilo do body e fundo geral */
  body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #766f7a;
    padding: 0;
  }
  
  /* Navbar */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 50px;
    background-color: #f3f3f3;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .navbar nav a {
    margin: 0 15px;
    color: #531b76;
    text-decoration: none;
    font-size: 20px;
  }
  
  .navbar .login-button {
    background-color: #531b76;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 18px;
    text-decoration: none;
  }
  
  .navbar img {
    width: 100px;
    height: auto;
  }
  
  /* Container principal */
  .container {
    max-width: 900px;
    width: 100%;
    background-color: #fff;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    overflow: hidden;
    padding: 20px;
    margin: 20px auto;
  }
  
  /* Seção de imagens do veículo */
  .image-gallery {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
  
  .image-gallery img {
    width: 100%;
    max-width: 200px;
    height: auto;
    border-radius: 10px;
  }
  
  /* Seção de detalhes do veículo e informações do vendedor */
  .vehicle-info {
    display: flex;
    justify-content: space-between; /* Divide em lados opostos */
    margin-top: 20px;
    padding: 20px;
    background-color: #fafafa;
    border-radius: 10px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  }
  
  .vehicle-details {
    width: 45%; /* Ocupa 45% do espaço */
  }
  
  .vehicle-price {
    font-size: 24px;
    color: #5b3199;
    font-weight: bold;
    margin-top: 10px;
  }
  
  .icon-star {
    color: #5b3199;
    font-size: 20px;
    margin-left: 5px;
    cursor: pointer;
  }
  
  /* Informações do vendedor */
  .seller-info {
    width: 45%; /* Ocupa 45% do espaço */
    text-align: left; /* Alinha à esquerda */
  }
  
  .seller-info h3 {
    font-size: 18px;
    margin-bottom: 15px;
    color: #333;
  }
  
  .seller-contact {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 5px;
    font-size: 14px;
  }
  
  .seller-contact .contact-icon {
    font-size: 24px;
    color: #5b3199;
  }
  
  /* Rodapé do anúncio */
  .footer-link {
    text-align: center;
    font-size: 14px;
    margin-top: 20px;
  }
  
  .footer-link a {
    color: #5b3199;
    text-decoration: none;
  }
  
  .footer-link a:hover {
    text-decoration: underline;
  }
  </style>
  