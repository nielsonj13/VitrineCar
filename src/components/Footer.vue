<template>
  <footer class="footer">
    <div class="footer-container">
      
      <!-- LOGO E DESCRIÇÃO -->
      <div class="footer-section">
        <img src="/public/logos/logo_vitrinecar_branca.png" alt="VitrineCar" class="footer-logo">
      </div>

      <!-- LINKS RÁPIDOS ORGANIZADOS EM DUAS COLUNAS -->
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
          <router-link to="/SobreNos"><i class="bi bi-info-circle"></i> Sobre Nós</router-link>
        </div>
      </div>
      
    </div>

    <!-- DIREITOS AUTORAIS -->
    <div class="footer-bottom">
      <p>&copy; 2025 VitrineCar - Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

---

### **🎨 Estilização Atualizada**
```css
<style scoped>
/* Estilização do Rodapé */
.footer {
  background: #5b3199; /* Tom de roxo mais moderno */
  color: white;
  padding: 30px 0;
  text-align: center;
  font-size: 14px;
}

/* Layout Responsivo do Rodapé */
.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1100px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 30px;
}

/* Seção da Logo e Descrição */
.footer-section {
  flex: 1;
  min-width: 250px;
  text-align: left;
  padding: 10px;
}

.footer-logo {
  width: 220px;
  margin-bottom: 10px;
}

.footer-description {
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.5;
}

/* Organização dos Links */
.footer-links {
  display: flex;
  justify-content: space-between;
  flex: 1;
  min-width: 300px;
  gap: 40px;
}

.footer-column {
  text-align: left;
}

.footer-column h4 {
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 5px;
  display: inline-block;
}

.footer-column a {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  text-decoration: none;
  font-size: 15px;
  margin-bottom: 8px;
  transition: color 0.3s ease, transform 0.3s;
}

.footer-column a:hover {
  color: #dfdfdf;
  transform: translateX(5px);
}

/* Ícones do Bootstrap */
.bi {
  font-size: 18px;
  color: #dfdfdf;
}

/* Rodapé Inferior */
.footer-bottom {
  margin-top: 15px;
  font-size: 13px;
  opacity: 0.8;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

/* Responsividade */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    align-items: center;
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
    font-size: 14px;
  }

  .footer-logo {
    width: 180px;
  }
}
</style>
