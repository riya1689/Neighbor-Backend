import * as userService from './user.service.js';

export const selectNeighborhood = async (req, res, next) => {
  try {
    const { neighborhoodId } = req.body;
    if (!neighborhoodId) {
      const error = new Error('Neighborhood ID is required');
      error.statusCode = 400;
      throw error;
    }
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

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await userService.getProfile(userId);

    res.status(200).json({
      status: 'success',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name) {
      const error = new Error('Name is required for updating profile');
      error.statusCode = 400;
      throw error;
    }

    const updatedProfile = await userService.updateProfile(userId, { name });

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};