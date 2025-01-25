import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { collection, doc, setDoc, getDocs, deleteDoc, query, where } from "firebase/firestore";

class FavoritosService {
  constructor() {
    this.collectionName = "favoritos";
  }

  // Obtém a lista de favoritos do usuário logado no Firestore
  async getFavoritos() {
    const user = this.getUsuarioLogado();
    if (!user) {
      alert("Você precisa estar logado para visualizar favoritos.");
      return [];
    }

    try {
      const q = query(collection(db, this.collectionName), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
      throw new Error("Erro ao buscar favoritos.");
    }
  }

  // Adiciona um anúncio aos favoritos do usuário logado
  async adicionarFavorito(anuncio) {
    const user = this.getUsuarioLogado();
    if (!user) {
      alert("Você precisa estar logado para favoritar um anúncio.");
      return;
    }

    try {
      const favoritoRef = doc(db, this.collectionName, `${user.uid}_${anuncio.id}`);
      await setDoc(favoritoRef, { ...anuncio, userId: user.uid });
      
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
      alert("Erro ao adicionar favorito.");
    }
  }

  // Remove um anúncio dos favoritos do usuário logado
  async removerFavorito(id) {
    const user = this.getUsuarioLogado();
    if (!user) {
      alert("Você precisa estar logado para remover um favorito.");
      return;
    }

    try {
      const favoritoRef = doc(db, this.collectionName, `${user.uid}_${id}`);
      await deleteDoc(favoritoRef);
      
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      alert("Erro ao remover favorito.");
    }
  }

  // Verifica se um anúncio está nos favoritos do usuário logado
  async isFavorito(id) {
    const user = this.getUsuarioLogado();
    if (!user) return false;

    try {
      const q = query(collection(db, this.collectionName), where("userId", "==", user.uid), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
      return false;
    }
  }

  // Obtém o usuário logado
  getUsuarioLogado() {
    const auth = getAuth();
    return auth.currentUser;
  }
}

export default new FavoritosService();
