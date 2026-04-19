import * as commentService from "./comment.service.js";

export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      const error = new Error("Content is required");
      error.statusCode = 400;
      throw error;
    }

    const comment = await commentService.createComment(userId, postId, content);
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await commentService.getPostComments(postId);
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
