import { UserModel } from "../models/user.model.js";
import { ApiError } from "@resume-buddy/utils";
import { deepMerge } from "@resume-buddy/utils";

export async function getUserProfileService(id: string) {
  const user = await UserModel.findOne({ _id: id })
    .select("-password -__v -_id")
    .lean()
    .then((data) => {
      if (!data) {
        throw new ApiError(404, "User not found");
      }
      return data;
    });
  return user;
}

export async function updateUserProfileService(id: string, updateData: Record<string, any>) {
  if (!Object.keys(updateData).length) {
    throw new ApiError(400, "No fields to update");
  }

  const user = await UserModel.findOne({ _id: id }).lean();
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const mergedData = deepMerge<typeof user>(user, updateData);
  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: id },
    { $set: mergedData },
    {
      new: true,
      projection: { id: 1, name: 1, email: 1, role: 1, avatar: 1, createdAt: 1, updatedAt: 1 },
    }
  ).lean();
  return updatedUser;
}
