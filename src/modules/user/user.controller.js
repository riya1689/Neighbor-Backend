import * as userService from './user.service.js';

export const selectNeighborhood = async (req, res, next) => {
  try {
    const { neighborhoodId } = req.body;
    const userId = req.user.id;

    const updatedUser = await userService.updateNeighborhood(userId, neighborhoodId);

    res.status(200).json({
      status: 'success',
      message: 'Neighborhood selected successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error); // Passes to your global error handler
  }
};