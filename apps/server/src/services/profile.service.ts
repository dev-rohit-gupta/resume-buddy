import { UserModel } from "../models/user.model.js";
import { ApiError } from "@resume-buddy/utils";

export async function getUserProfileService(id: string) {
  const user = await UserModel.findOne({ id })
    .select("-password -__v -_id")
    .lean()
    .then((data) => {
      if (!data) {
        throw new ApiError(404,"User not found");
      }
      return data;
    });
  return user;
}

export async function updateUserProfileService(id: string, updateData: Partial<typeof UserModel>) {
    const updatedUser = await UserModel.findOneAndUpdate({ id }, updateData, { new: true });
    if (!updatedUser) {
        throw new ApiError(404,"User not found");
    }
    return updatedUser;
}