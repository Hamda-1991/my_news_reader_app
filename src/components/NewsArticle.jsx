import PropTypes from "prop-types";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import StyledCard from "./StyledCard";
import { styled } from "@mui/material/styles";

const Link = styled("a")(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.text.primary,
  cursor: "pointer",
}));

function NewsArticle(props) {
  const { image, title, description, url, author, publishedAt } = props;

  return (
    <StyledCard>
      <Link target="_blank" href={url}>
        <CardActionArea>
          {image && (
            <CardMedia component="img" height="200" image={image} alt={title} />
          )}
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
      <Box p={2}>
        <Typography variant="caption" color="textSecondary" display="block">
          {author ? `Author: ${author}` : "Unknown Author"}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {new Date(publishedAt).toLocaleDateString()}
        </Typography>
      </Box>
    </StyledCard>
  );
}

// Add PropTypes validation
NewsArticle.propTypes = {
  image: PropTypes.string, // Optional because the API may not always include it
  title: PropTypes.string.isRequired, // Ensure title is provided
  description: PropTypes.string, // Optional since it may be missing
  url: PropTypes.string.isRequired, // Required because links are necessary
  author: PropTypes.string, // Optional since some articles may lack an author
  publishedAt: PropTypes.string.isRequired, // Required; format can be ISO date string
};

// Default Props in case API doesn't return specific fields
NewsArticle.defaultProps = {
  image: "https://via.placeholder.com/200", // Placeholder image if none is provided
  description: "No description available.", // Fallback for missing description
  author: "Unknown Author", // Fallback for missing author
};

export default NewsArticle;
