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
      path: '/TelaVeiculo',
      name: 'TelaVeiculo',
      component: TelaVeiculo,
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
    // Rota para editar o anúncio com ID dinâmico
    {
      path: '/editar-anuncio',
      name: 'EditarAnuncio',
      component: EditarAnuncio,
      props: true,
    },
  ],
});

export default router;
