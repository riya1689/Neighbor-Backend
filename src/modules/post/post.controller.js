import * as postService from "./post.service.js";

export const createPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userNeighborhoodId = req.user.neighborhoodId;
    const postData = req.body;

    const post = await postService.createPost(userId, userNeighborhoodId, postData);

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};
