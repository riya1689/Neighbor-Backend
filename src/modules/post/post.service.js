import prisma from "../../config/prisma.js";

export const createPost = async (userId, userNeighborhoodId, postData) => {
  // PRD Validation: Compare userNeighborhoodId with postData.neighborhoodId.
  if (userNeighborhoodId !== postData.neighborhoodId) {
    const error = new Error("Unauthorized: You can only create posts in your joined neighborhood");
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
    }
  });

  return post;
};
