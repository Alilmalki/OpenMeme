/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import Comments from "../Comment/Comment";
import ThemeContext from "../../utils/Themes/ThemeContext";
import "./Card.css";

// Only top 3-4 comments to be displayed.

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
    })
}));

export default function RecipeReviewCard() {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const { isDark } = React.useContext(ThemeContext);
    const themeMode = isDark ? "dark-card" : "light-card";

    return (
        <Card className={`card-container ${themeMode}`}>
            <CardHeader
                avatar={
                    <Avatar className="avatar" aria-label="recipe">
                        N
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <DeleteIcon />
                    </IconButton>
                }
                title="Name PlaceHolder"
            />
            <CardMedia component="img" image="" alt="404" />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {" "}
                    Babu Rao Meme
                </Typography>
            </CardContent>

            <CardActions disableSpacing>
                <Box className="box">
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                </Box>
                <Typography>Comments</Typography>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Comments />
                </CardContent>
            </Collapse>
        </Card>
    );
}
