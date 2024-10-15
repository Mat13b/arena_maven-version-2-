import React, { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useParams } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import getUserName from "@services/getUserName";
import formatDate from "@services/formatDate";

function CommentSection({ tournament }) {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/comments/by-tournament/${tournament.id}`)
      .then((response) => {
        const lastThreeComments = response.data.slice(-3);
        console.log("Commentaires récupérés:", lastThreeComments); // Check fetched comments
        setComments(lastThreeComments);
        localStorage.setItem(`comments-${id}`, JSON.stringify(lastThreeComments));
      })
      .catch((error) => {
        console.error("Erreur de chargement des commentaires:", error);
        const savedComments = localStorage.getItem(`comments-${id}`);
        if (savedComments) {
          console.log("Commentaires récupérés depuis le localStorage:", JSON.parse(savedComments));
          setComments(JSON.parse(savedComments));
        }
      });
  }, [id, tournament.id]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Erreur de chargement des utilisateurs:", error));
  }, []);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const getUserInfo = () => {
    const token = getToken();
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken; // { id, username, email, role }
    }
    return null;
  };

  const updateLocalStorage = (comments) => {
    localStorage.setItem(`comments-${id}`, JSON.stringify(comments));
  };

  const handleAddComment = () => {
    const userInfo = getUserInfo();
    if (!userInfo) {
      console.error("Utilisateur non connecté");
      return;
    }

    const commentData = {
      content: newComment,
      user_id: userInfo.sub.id,
      tournament_id: tournament.id,
    };

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/comments`, commentData)
      .then((response) => {
        console.log("Réponse du serveur après ajout du commentaire:", response.data);
        if (response.status === 201) {
          const newComments = [
            ...comments,
            {
              ...commentData,
              username: userInfo.sub.username,
              created_at: new Date().toISOString(),
              id: response.data.id, // Ensure ID is correctly set here
            },
          ];
          setComments(newComments);
          updateLocalStorage(newComments);
          setNewComment("");
        } else {
          console.error("Erreur lors de l'ajout du commentaire:", response);
        }
      })
      .catch((error) => console.error("Erreur lors de l'ajout du commentaire:", error));
  };

  const handleEditComment = (commentId) => {
    console.log("Edition du commentaire avec l'ID:", commentId);
    setEditingComment(commentId);
    const comment = comments.find((comment) => comment.id === commentId);
    setEditedContent(comment.content);
  };

  const handleUpdateComment = (commentId) => {
    console.log("Mise à jour du commentaire avec l'ID:", commentId);
    const userInfo = getUserInfo();
    if (!userInfo) {
      console.error("Utilisateur non connecté");
      return;
    }

    axios
      .put(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${commentId}`, {
        content: editedContent,
        user_id: userInfo.sub.id,
        tournament_id: tournament.id,
      })
      .then(() => {
        const updatedComments = comments.map((comment) =>
          comment.id === commentId ? { ...comment, content: editedContent } : comment
        );
        setComments(updatedComments);
        updateLocalStorage(updatedComments);
        setEditingComment(null);
        setEditedContent("");
      })
      .catch((error) => console.error("Erreur lors de la mise à jour du commentaire:", error));
  };

  const handleDeleteComment = (commentId) => {
    console.log("Suppression du commentaire avec l'ID:", commentId);
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${commentId}`)
      .then(() => {
        const updatedComments = comments.filter((comment) => comment.id !== commentId);
        setComments(updatedComments);
        updateLocalStorage(updatedComments);
      })
      .catch((error) => console.error("Erreur lors de la suppression du commentaire:", error));
  };

  // const getUserName = (id) => {
  //   const user = users.find((user) => user.id === parseInt(id, 10));
  //   return user ? user.username : "Unknown User";
  // };
  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  //   return new Date(dateString).toLocaleDateString("fr-FR", options);
  // };
  const userInfo = getUserInfo();

  return (
    <div className="w-full mt-4">
      <div className="overflow-y-auto max-h-80">
        {comments.map((comment, index) => (
          <div key={index} className="bg-gray-100 p-3 rounded-lg mb-2">
            <p className="text-lg font-bold">{getUserName(comment.user_id,users)}</p>
            <p className="text-sm">{formatDate(comment.created_at)}</p>
            {editingComment === comment.id ? (
              <div className="flex flex-col">
                <textarea
                  className="w-full p-2 text-black border border-gray-300 rounded-md"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <button
                  className="mt-2 bg-warning hover:bg-vertBG text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleUpdateComment(comment.id)}
                >
                  Modifier votre commentaire
                </button>
              </div>
            ) : (
              <p className="text-sm">{comment.content}</p>
            )}
            {userInfo && (userInfo.sub.id === comment.user_id || userInfo.sub.role === "moderator") && (
              <div className="flex space-x-2 mt-2 justify-end">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleEditComment(comment.id)}
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <textarea
          className="w-full p-2 text-black border border-gray-300 rounded-md"
          placeholder="Ajoutez un commentaire..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="mt-2 bg-primary hover:bg-vertBG text-white font-bold py-2 px-4 rounded"
          onClick={handleAddComment}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}

export default CommentSection;
