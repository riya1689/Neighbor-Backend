import prisma from '../../config/prisma.js';

export const updateNeighborhood = async (userId, neighborhoodId) => {
  // 1. Verify neighborhood exists
  const neighborhood = await prisma.neighborhood.findUnique({
    where: { id: neighborhoodId },
  });

  if (!neighborhood) {
    const error = new Error('Neighborhood not found');
    error.statusCode = 404;
    throw error;
  }

  // 2. Update user
  return await prisma.user.update({
    where: { id: userId },
    data: { neighborhoodId },
    select: { id: true, name: true, email: true, neighborhoodId: true },
  });
};