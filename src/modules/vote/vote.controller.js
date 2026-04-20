import * as voteService from "./vote.service.js";

export const handleVote = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    if (!['UPVOTE', 'DOWNVOTE'].includes(type)) {
      const error = new Error("Invalid vote type sent. Must be 'UPVOTE' or 'DOWNVOTE'.");
      error.statusCode = 400;
      throw error;
    }

    await voteService.handleVote(userId, postId, type);
    const tally = await voteService.getPostTally(postId);

    res.status(200).json({
      message: "Vote processed successfully",
      tally
    });
  } catch (error) {
    next(error);
  }
};
