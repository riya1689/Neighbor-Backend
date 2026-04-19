import prisma from "../../config/prisma.js";

export const createPost = async (userId, userNeighborhoodId, postData) => {
  // PRD Validation: Compare userNeighborhoodId with postData.neighborhoodId.
  if (userNeighborhoodId !== postData.neighborhoodId) {
    const error = new Error("Forbidden: You can only post in your own neighborhood");
    error.statusCode = 403;
    throw error;
  }

  const { title, content, images, isPremium, price, neighborhoodId, categoryId } = postData;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      images: images || [],
      isPremium: isPremium || false,
      price: price || 0,
      userId,
      neighborhoodId,
      categoryId
    },
    include: {
      category: {
        select: {
          name: true
        }
      }
    }
  });

  return post;
};

export const getFeed = async (neighborhoodId) => {
  const posts = await prisma.post.findMany({
    where: { neighborhoodId },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
      category: { select: { name: true } }
    }
  });

  return posts;
};
