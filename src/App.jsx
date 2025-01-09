import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { debounce } from "lodash";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import NewsHeader from "./components/NewsHeader";
import NewsFeed from "./components/NewsFeed";
import Typography from "@mui/material/Typography";

const DEFAULT_PAGE_SIZE = 5;

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("general");

  const abortController = useRef(new AbortController());

  // Fetch data function with better error handling
  async function loadData(query, category, page) {
    const baseEndpoint = `https://newsapi.org/v2/top-headlines?country=eg&pageSize=${DEFAULT_PAGE_SIZE}&category=${category}&page=${page}&apiKey=${
      import.meta.env.VITE_NEWS_API_KEY
    }`;

    try {
      const response = await fetch(
        query ? `${baseEndpoint}&q=${query}` : baseEndpoint,
        {
          signal: abortController.current.signal,
        }
      );

      // Check for non-200 responses
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "ok") {
        throw new Error(`Error: ${data.code}, Details: ${data.message}`);
      }

      return data.articles?.map((article) => ({
        title: article.title || "Untitled",
        description: article.description || "No description available.",
        image: article.urlToImage || "https://via.placeholder.com/200",
        url: article.url || "#",
        author: article.author || "Unknown Author",
        publishedAt: article.publishedAt || new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error loading data:", error);
      setError(error.message); // Update the error state
      throw error; // Rethrow to propagate the error to the debounced function
    }
  }

  const debouncedFetch = useMemo(
    () =>
      debounce((query, category, page) => {
        setLoading(true);
        setError(undefined); // Clear previous errors
        abortController.current.abort(); // Abort previous request
        abortController.current = new AbortController(); // Create a new controller

        loadData(query, category, page)
          .then((articles) => {
            setLoading(false);
            setArticles(articles);
          })
          .catch((error) => {
            setLoading(false);
            setError(error.message); // Display the error message
          });
      }, 500),
    []
  );

  const fetchArticles = useCallback(
    (query, category, page) => {
      debouncedFetch(query, category, page);
    },
    [debouncedFetch]
  );

  useEffect(() => {
    fetchArticles(query, category, page);

    return () => {
      abortController.current.abort(); // Abort the request when the component unmounts
    };
  }, [query, category, page, fetchArticles]);

  const handleSearchChange = (newQuery) => {
    setQuery(newQuery);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  function handleNextPage() {
    setPage((prevPage) => prevPage + 1);
  }

  function handlePrevPage() {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  }

  return (
    <Container>
      <NewsHeader
        category={category}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
      />
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
      {!error && articles.length === 0 && !loading && (
        <Typography align="center" color="textSecondary">
          No articles found for your search.
        </Typography>
      )}
      {!error && (
        <NewsFeed
          articles={articles}
          loading={loading}
          pageSize={DEFAULT_PAGE_SIZE}
        />
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "20px 0",
        }}
      >
        <Button
          variant="outlined"
          onClick={handlePrevPage}
          disabled={loading || page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          onClick={handleNextPage}
          disabled={loading || articles.length < DEFAULT_PAGE_SIZE}
        >
          Next
        </Button>
      </div>
    </Container>
  );
}

export default App;
