// Yorum servisi için interface
class ICommentService {
  addComment(text, userData) {
    throw new Error("Method 'addComment()' must be implemented");
  }
  deleteComment(commentId) {
    throw new Error("Method 'deleteComment()' must be implemented");
  }
  updateComment(commentId, text) {
    throw new Error("Method 'updateComment()' must be implemented");
  }
}

// Gerçek yorum servisi
class RealCommentService extends ICommentService {
  async addComment(text, userData) {
    const { db } = await import('../firebase');
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    
    return await addDoc(collection(db, "comments"), {
      text,
      userId: userData.uid,
      userName: userData.fullName || userData.email,
      createdAt: serverTimestamp()
    });
  }

  async deleteComment(commentId) {
    const { db } = await import('../firebase');
    const { doc, deleteDoc } = await import('firebase/firestore');
    
    return await deleteDoc(doc(db, "comments", commentId));
  }

  async updateComment(commentId, text) {
    const { db } = await import('../firebase');
    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
    
    return await updateDoc(doc(db, "comments", commentId), {
      text,
      updatedAt: serverTimestamp()
    });
  }
}

// Proxy yorum servisi
class CommentServiceProxy extends ICommentService {
  constructor() {
    super();
    this.realService = new RealCommentService();
  }

  async addComment(text, userData) {
    if (!userData) {
      throw new Error("Yorum yapmak için giriş yapmalısınız!");
    }
    return await this.realService.addComment(text, userData);
  }

  async deleteComment(commentId, userId) {
    if (!userId) {
      throw new Error("Bu işlem için giriş yapmalısınız!");
    }
    return await this.realService.deleteComment(commentId);
  }

  async updateComment(commentId, text, userId) {
    if (!userId) {
      throw new Error("Bu işlem için giriş yapmalısınız!");
    }
    return await this.realService.updateComment(commentId, text);
  }
}

export const commentService = new CommentServiceProxy(); 