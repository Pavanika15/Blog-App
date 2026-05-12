import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

import {
  pageWrapper,
  articleGrid,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  timestampClass,
  ghostBtn,
  loadingClass,
  errorClass,
  submitBtn,
} from "../styles/common";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    // Don't fetch if auth check is still loading or user not authenticated
    if (authLoading || !isAuthenticated) return;

    const getArticles = async () => {
      setLoading(true);

      try {
        const res = await axios.get("http://localhost:4000/user-api/articles", {
          withCredentials: true,
        });

        setArticles(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, [isAuthenticated, authLoading]);

  const openArticle = (article) => {
    navigate(`/article/${article._id}`, {
      state: article,
    });
  };

  if (authLoading) return <p className={loadingClass}>Loading...</p>;

  if (!isAuthenticated) {
    return (
      <div className={pageWrapper}>
        <div className="mb-16 text-center">
          <h1 className="text-6xl font-bold text-[#1d1d1f] tracking-tight">
            MyBlog
          </h1>

          <p className="text-[#6e6e73] mt-4 max-w-xl mx-auto text-lg">
            Discover thoughtful articles on technology, programming, artificial
            intelligence and modern web development.
          </p>

          <div className="mt-8">
            <button
              className={submitBtn}
              onClick={() => navigate("/login")}
            >
              Sign In to Read Articles
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <p className={loadingClass}>Loading articles...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  return (
    <div className={pageWrapper}>
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="text-6xl font-bold text-[#1d1d1f] tracking-tight">
          MyBlog
        </h1>

        <p className="text-[#6e6e73] mt-4 max-w-xl mx-auto text-lg">
          Discover thoughtful articles on technology, programming, artificial
          intelligence and modern web development.
        </p>
      </div>

      {/* Articles */}
      <div className={articleGrid}>
        {articles.map((article) => (
          <div key={article._id} className={articleCardClass}>
            <p className={articleTitle}>{article.title}</p>

            <p className={articleExcerpt}>{article.content.slice(0, 80)}...</p>

            <p className={timestampClass}>
              {new Date(article.createdAt).toLocaleDateString()}
            </p>

            <button
              className={`${ghostBtn} mt-auto pt-3`}
              onClick={() => openArticle(article)}
            >
              Read Article →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;