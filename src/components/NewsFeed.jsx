import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types"; // Import PropTypes
import NewsArticle from "./NewsArticle";
import LoadingArticle from "./LoadingArticle";

/**
 * The main news feed list of articles.
 */
function NewsFeed(props) {
  const { articles, loading, pageSize } = props;

  return (
    <Box>
      {loading &&
        [...Array(pageSize)].map((_, index) => <LoadingArticle key={index} />)}
      {!loading && articles.length === 0 && (
        <Typography
          align="center"
          variant="h6"
          color="textSecondary"
          marginTop={4}
        >
          No articles found.
        </Typography>
      )}
      {!loading &&
        articles.length > 0 &&
        articles.map((article, index) => (
          <NewsArticle key={index} {...article} />
        ))}
    </Box>
  );
}

// Add PropTypes validation
NewsFeed.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      image: PropTypes.string,
      url: PropTypes.string.isRequired,
      author: PropTypes.string,
      publishedAt: PropTypes.string,
    })
  ).isRequired, // Validate that `articles` is an array of objects and required
  loading: PropTypes.bool.isRequired, // Validate that `loading` is a boolean and required
  pageSize: PropTypes.number.isRequired, // Validate that `pageSize` is a number and required
};

export default NewsFeed;
