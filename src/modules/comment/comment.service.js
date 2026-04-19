import prisma from "../../config/prisma.js";

export const createComment = async (userId, postId, content) => {
  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      userId,
      postId
    },
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  });

  return comment;
};

export const getPostComments = async (postId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: {
          name: true,
          role: true
        }
      }
    }
  });

  return comments;
};
