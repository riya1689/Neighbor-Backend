import prisma from "../../config/prisma.js";

export const handleVote = async (userId, postId, type) => {
  // Validate if post exists
  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  // Check existing vote for toggle logic
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_postId: {
        userId,
        postId
      }
    }
  });

  if (existingVote && existingVote.type === type) {
    // Toggle logic: delete vote (un-vote)
    await prisma.vote.delete({
      where: {
        userId_postId: { userId, postId }
      }
    });
  } else {
    // Create new or update existing vote using upsert
    await prisma.vote.upsert({
      where: {
        userId_postId: { userId, postId }
      },
      update: { type },
      create: {
        userId,
        postId,
        type
      }
    });
  }
};

export const getPostTally = async (postId) => {
  const upvotes = await prisma.vote.count({
    where: {
      postId,
      type: 'UPVOTE'
    }
  });

  const downvotes = await prisma.vote.count({
    where: {
      postId,
      type: 'DOWNVOTE'
    }
  });

  return upvotes - downvotes;
};
