import { db } from "../firebase"; 
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

class DAOService {
  constructor(collectionPath) {
    if (!collectionPath) {
      throw new Error("Collection path must be provided");
    }
    this.collectionRef = collection(db, collectionPath);
    this.collectionName = collectionPath;
  }

  // Método para obter anúncios de um usuário específico
  async getAnunciosPorUsuario(userId) {
    try {
      const q = query(this.collectionRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erro ao buscar anúncios do usuário: ", error);
      throw new Error("Erro ao buscar anúncios do usuário");
    }
  }

  // Método para inserir um novo objeto com associação ao usuário logado
  async insert(object) {
    try {
      const docRef = await addDoc(this.collectionRef, object);
      return docRef.id; 
    } catch (error) {
      console.error("Erro ao adicionar documento: ", error);
      throw new Error("Erro ao adicionar documento");
    }
  }

  // Método para atualizar um documento existente
  async update(id, object) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, object);
    } catch (error) {
      console.error("Erro ao atualizar documento: ", error);
      throw new Error("Erro ao atualizar documento");
    }
  }

  // Método para excluir um documento
  async delete(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Erro ao excluir documento: ", error);
      throw new Error("Erro ao excluir documento");
    }
  }

  // Método para buscar todos os documentos da coleção
  async getAll() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erro ao buscar documentos: ", error);
      throw new Error("Erro ao buscar documentos");
    }
  }

  // Método para buscar um documento específico pelo ID
  async get(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("Documento não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao buscar documento: ", error);
      throw new Error("Erro ao buscar documento");
    }
  }

  // Método para buscar documentos com base em um campo específico
  async searchByField(field, value) {
    try {
      const q = query(this.collectionRef, where(field, "==", value.toLowerCase()));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      throw new Error("Erro ao buscar documentos");
    }
  }

  // Método para buscar documentos com base em múltiplos campos (marca e modelo)
  async searchByTerm(term) {
    try {
      const lowerTerm = term.toLowerCase();

      // Consulta por campo "modelo"
      const modeloQuery = query(this.collectionRef, where("modelo", "==", lowerTerm));
      const modeloSnapshot = await getDocs(modeloQuery);

      // Consulta por campo "marca"
      const marcaQuery = query(this.collectionRef, where("marca", "==", lowerTerm));
      const marcaSnapshot = await getDocs(marcaQuery);

      // Combina os resultados de ambas as consultas
      const results = [];
      modeloSnapshot.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
      marcaSnapshot.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));

      // Remove duplicatas (baseado no ID)
      return results.filter(
        (item, index, self) => self.findIndex((v) => v.id === item.id) === index
      );
    } catch (error) {
      console.error("Erro ao buscar documentos por termo:", error);
      throw new Error("Erro ao buscar documentos por termo");
    }
  }
}

export default DAOService;
