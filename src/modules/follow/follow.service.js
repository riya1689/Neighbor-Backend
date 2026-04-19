import prisma from "../../config/prisma.js";

export const followUser = async (followerId, followingId) => {
  if (followerId === followingId) {
    const error = new Error("You cannot follow yourself");
    error.statusCode = 400;
    throw error;
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: followingId }
  });

  if (!targetUser) {
    const error = new Error("Target user not found");
    error.statusCode = 404;
    throw error;
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId
      }
    }
  });

  if (existingFollow) {
    const error = new Error("You are already following this user");
    error.statusCode = 400;
    throw error;
  }

  const follow = await prisma.follow.create({
    data: {
      followerId,
      followingId
    }
  });

  return follow;
};

export const unfollowUser = async (followerId, followingId) => {
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId
      }
    }
  });

  if (!existingFollow) {
    const error = new Error("You are not following this user");
    error.statusCode = 400;
    throw error;
  }

  await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId
      }
    }
  });

  return { message: "Successfully unfollowed user" };
};

export const getFollowers = async (userId) => {
  const followers = await prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          role: true
        }
      }
    }
  });

  return followers.map(f => f.follower);
};

export const getFollowing = async (userId) => {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          role: true
        }
      }
    }
  });

  return following.map(f => f.following);
};
