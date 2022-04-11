const Meme = require("../models/meme");

// Get all Memes
const getAllMemes = async (req, res) => {
    const memes = await Meme.find({}).sort({ createdAt: -1 });
    res.status(200).send(memes);
};

// Get a Meme by id
const getMemeById = async (req, res) => {
    try {
        const meme = await Meme.findOne({ _id: req.params.id });
        res.status(200).send(meme);
    } catch (error) {
        res.status(404);
        res.send({ error: "Meme doesn't exist!" });
    }
};

// Add a new Meme
const createMeme = async (req, res) => {
    const meme = new Meme({
        caption: req.body.caption,
        mediaUrl: req.body.mediaUrl,
        author: {
            userName: req.body.author.userName,
            profilePicture: req.body.author.profilePicture
        }
    });
    await meme.save();
    res.send(meme);
};

// Edit an existing meme
const updateMemeById = async (req, res) => {
    try {
        const meme = await Meme.findOne({ _id: req.params.id });

        if (req.body.caption) {
            meme.caption = req.body.caption;
        }

        if (req.body.mediaUrl) {
            meme.mediaUrl = req.body.mediaUrl;
        }

        await meme.save();
        res.status(200).send(meme);
    } catch {
        res.status(404);
        res.send({ error: "Meme doesn't exist!" });
    }
};

// Delete a Meme
const deleteMemeById = async (req, res) => {
    try {
        await Meme.deleteOne({ _id: req.params.id });
        res.status(204).send();
    } catch {
        res.status(404);
        res.send({ error: "Meme doesn't exist!" });
    }
};

// Like a Meme
// method : PUT
// Body : {id: id of the meme, userName : userName of user who likes the post}
// If a user has already liked a post then another request from the same user will
// result in unlike!
const likeMeme = async (req, res) => {
    try {
        if (req.body.userName) {
            const meme = await Meme.findOne({ _id: req.body.id });
            if (meme.likes.likedBy.includes(req.body.userName)) {
                meme.likes.likeCount -= 1;
                meme.likes.likedBy = meme.likes.likedBy.filter(
                    (x) => x !== req.body.userName
                );
                await meme.save();
                res.status(200).send({ action: "unliked", meme });
            } else {
                meme.likes.likeCount += 1;
                meme.likes.likedBy.push(req.body.userName);
                await meme.save();
                res.status(200).send({ action: "liked", meme });
            }
        } else {
            res.status(400).send({ error: "UserName required!" });
        }
    } catch (err) {
        res.status(400);
        res.send({ error: "Meme doesn't exist!" });
    }
};

// Get Top 3 Liked Posts
// If two or more posts have same number of likes, the one posted earliest is returned
const getTopLikedMemes = async (req, res) => {
    try {
        const memes = await Meme.find()
            .sort({ "likes.likeCount": -1, createdAt: 1 })
            .limit(3);
        res.status(200).send(memes);
    } catch (err) {
        res.status(500);
        res.send("Internal server Error");
    }
};

//Get users who liked a meme
//Body : {id: id of the meme}
const getMemeLikers = async (req, res) => {
    try{
        const { id } = req.body;
        const memeLikers = await Meme.findOne({_id: id}).likedBy;
        res.status(200).send(memeLikers);
    } catch(err) {
        res.status(404);
        res.send({error: "Meme not found!"});
    }
}

// Comment On a Meme

// Post Comment on a Meme
// method : POST
// Body : {id: id of the meme, comment : comment body, author : { userName : userName of user, profilePicture(optional) : url}}

const postComment = async (req, res) => {
    try {
        const { comment, id, author } = req.body;
        const meme = await Meme.findOne({ _id: id });
        meme.comments.push({
            comment,
            author
        });
        await meme.save();
        res.status(201).send({ action: "Comment posted successfully!", meme });
    } catch (err) {
        res.status(400).send(
            "Meme/Comment doesn't exists OR Improper request format!"
        );
    }
};

// Delete Comment on a Meme
// method : DELETE
// Body : {id: Id of the comment to be deleted}
// meme's id to be passed in params
const deleteCommentById = async (req, res) => {
    try {
        const meme = await Meme.findById({ _id: req.params.id });
        meme.comments.pull(req.body.id);

        await meme.save();
        res.status(200).send({ action: "Comment deleted successfully!" });
    } catch (err) {
        res.status(400);
        res.send({ error: "Comment doesn't exist!" });
    }
};

// Update Comment On a Meme
// method : PATCH
// Body : {id: Id of the comment to be edited, editedComment : edited body, }
// meme's id to be passed in params
const updateCommentById = async (req, res) => {
    try {
        const meme = await Meme.findById({ _id: req.params.id });
        const item = meme.comments.id(req.body.id);
        item.comment = req.body.editedComment;
        await meme.save();
        res.status(200).send({ action: "Comment updated successfully!", meme });
    } catch (err) {
        res.status(400);
        res.send({
            error: "Meme/ Comment doesn't exist OR Improper request format!"
        });
    }
};

module.exports = {
    getAllMemes,
    getMemeById,
    createMeme,
    updateMemeById,
    deleteMemeById,
    likeMeme,
    postComment,
    deleteCommentById,
    updateCommentById,
    getTopLikedMemes,
    getMemeLikers
};
