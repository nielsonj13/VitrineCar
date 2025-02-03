import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import TelaCadastro from '../views/TelaCadastro.vue';
import RecuperarSenha from '../views/RecuperarSenha.vue';
import EsqueceuSenha from '../views/EsqueceuSenha.vue';
import CodigoRecuperacao from '../views/CodigoRecuperacao.vue';
import CriarAnuncio from '@/views/CriarAnuncio.vue';
import TelaPrincipal from '@/views/TelaPrincipal.vue';
import NavBar from '@/components/NavBar.vue';
import TelaVeiculo from '@/views/TelaVeiculo.vue';
import TelaFavoritos from '@/views/TelaFavoritos.vue';
import TelaMinhaConta from '@/views/TelaMinhaConta.vue';
import TelaMeusAnuncios from '@/views/TelaMeusAnuncios.vue';
import EditarAnuncio from '@/views/EditarAnuncio.vue';
import TelaResultados from '@/views/TelaResultados.vue';
import TelaAnuncios from '@/views/TelaAnuncios.vue';
import Footer from '@/components/Footer.vue';

// https://vitrinecar-71a27.web.app

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'TelaPrincipal',
      component: TelaPrincipal,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/cadastro',
      name: 'TelaCadastro',
      component: TelaCadastro,
    },
    {
      path: '/recuperar-senha',
      name: 'RecuperarSenha',
      component: RecuperarSenha,
    },
    {
      path: '/esqueceu-senha',
      name: 'EsqueceuSenha',
      component: EsqueceuSenha,
    },
    {
      path: '/codigo-recuperacao',
      name: 'CodigoRecuperacao',
      component: CodigoRecuperacao,
    },
    {
      path: '/criar-anuncio',
      name: 'CriarAnuncio',
      component: CriarAnuncio,
    },
    {
      path: '/navbar',
      name: 'Navbar',
      component: NavBar,
    },
    {
      path: '/footer',
      name: 'Footer',
      component: Footer,
    },
    {
      path: '/veiculo/:id',
      name: 'TelaVeiculo',
      component: TelaVeiculo,
      props: true,
    },
    {
      path: '/TelaFavoritos',
      name: 'TelaFavoritos',
      component: TelaFavoritos,
    },
    {
      path: '/TelaMinhaConta',
      name: 'TelaMinhaConta',
      component: TelaMinhaConta,
    },
    {
      path: '/TelaMeusAnuncios',
      name: 'TelaMeusAnuncios',
      component: TelaMeusAnuncios,
    },
    {
      path: '/TelaAnuncios',
      name: 'TelaAnuncios',
      component: TelaAnuncios,
    },
    {
      path: '/TelaResultados',
      name: 'TelaResultados',
      component: TelaResultados,
      props: true,
    },
    // Rota para editar o anúncio com ID dinâmico
    {
      path: '/editar-anuncio/:id',
      name: 'EditarAnuncio',
      component: EditarAnuncio,
      props: true,
    },
  ],
});

export default router;
