import * as followService from "./follow.service.js";

export const followUser = async (req, res, next) => {
  try {
    const { id: followingId } = req.params;
    const followerId = req.user.id;

    const follow = await followService.followUser(followerId, followingId);
    res.status(201).json({ message: "Successfully followed user", follow });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const { id: followingId } = req.params;
    const followerId = req.user.id;

    const result = await followService.unfollowUser(followerId, followingId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const followers = await followService.getFollowers(userId);
    res.status(200).json(followers);
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const following = await followService.getFollowing(userId);
    res.status(200).json(following);
  } catch (error) {
    next(error);
  }
};
