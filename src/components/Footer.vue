<template>
    <footer class="footer">
      <div class="footer-container">
        
        <!-- LOGO E DESCRIÇÃO -->
        <div class="footer-section">
          <img src="/public/logos/logo_vitrinecar_branca.png" alt="VitrineCar" class="footer-logo">
        </div>
  
        <!-- LINKS RÁPIDOS EM DUAS COLUNAS -->
        <div class="footer-links">
          <div class="footer-column">
            <h4>Links Principais</h4>
            <router-link to="/"><i class="bi bi-house-door"></i> Início</router-link>
            <router-link to="/TelaAnuncios"><i class="bi bi-car-front"></i> Comprar</router-link>
            <router-link to="/TelaMeusAnuncios"><i class="bi bi-megaphone"></i> Vender</router-link>
          </div>
          <div class="footer-column">
            <h4>Outros</h4>
            <router-link to="/TelaFavoritos"><i class="bi bi-star"></i> Favoritos</router-link>
            <router-link to="/TelaMinhaConta"><i class="bi bi-person"></i> Minha Conta</router-link>
            <router-link to="/Sobre"><i class="bi bi-info-circle"></i> Sobre Nós</router-link>
          </div>
        </div>
  
      </div>
  
      <!-- DIREITOS AUTORAIS -->
      <div class="footer-bottom">
        <p>&copy; 2025 VitrineCar - Todos os direitos reservados.</p>
      </div>
    </footer>
  </template>

<style scoped>
.footer {
  background: #531B76; /* Cor mais clara */
  color: white;
  padding: 20px 0; /* Mais compacto */
  text-align: center;
  font-size: 14px;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1000px;
  margin-left: 10%;
  margin-right: 10%;
  flex-wrap: wrap;
  gap: 20px;
}

/* LOGO E DESCRIÇÃO */
.footer-section {
  flex: 1;
  min-width: 200px;
  text-align: left;
  padding: 10px;
}

.footer-logo {
  width: 200px; /* Ajustado */
  margin-bottom: 5px;
  
}

/* LINKS EM DUAS COLUNAS */
.footer-links {
  display: flex;
  justify-content: space-between;
  flex: 1;
  min-width: 250px;
}

.footer-column {
  text-align: left;
}

.footer-column h4 {
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: bold;
  text-transform: uppercase;
}

.footer-column a {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 6px;
  transition: color 0.3s ease, transform 0.3s;
}

.footer-column a:hover {
  color: #dfdfdf;
  transform: scale(1.05);
}

/* ÍCONES DO BOOTSTRAP */
.bi {
  font-size: 18px;
  color: #dfdfdf;
}

/* RODAPÉ INFERIOR */
.footer-bottom {
  margin-top: 10px;
  font-size: 12px;
  opacity: 0.8;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

/* RESPONSIVIDADE */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    text-align: center;
  }

  .footer-links {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-column {
    margin-bottom: 15px;
  }

  .footer-column a {
    font-size: 13px;
  }
}
</style>
