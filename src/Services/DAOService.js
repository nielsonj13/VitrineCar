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
    this.collectionRef = collection(db, collectionPath); // Ref para a coleção no Firestore
  }

  // Método para inserir um novo objeto
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
      const docRef = doc(db, this.collectionRef.path, id);
      await updateDoc(docRef, object);
    } catch (error) {
      console.error("Erro ao atualizar documento: ", error);
      throw new Error("Erro ao atualizar documento");
    }
  }

  // Método para excluir um documento
  async delete(id) {
    try {
      const docRef = doc(db, this.collectionRef.path, id);
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
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } catch (error) {
      console.error("Erro ao buscar documentos: ", error);
      throw new Error("Erro ao buscar documentos");
    }
  }

  // Método para buscar um documento específico pelo ID
  async get(id) {
    try {
      const docRef = doc(db, this.collectionRef.path, id);
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

  // Método para buscar documentos com base em um filtro
async searchByField(field, value) {
  try {
    const q = query(this.collectionRef, where(field, "==", value));
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    console.error("Erro ao buscar documentos: ", error);
    throw new Error("Erro ao buscar documentos");
  }
}

}

export default DAOService;
