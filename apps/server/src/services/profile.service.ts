import { UserModel } from "../models/user.model.js";

export async function getUserProfileService(id: string) {
  const user = await UserModel.findOne({ id })
    .select("-password -__v -_id")
    .lean()
    .then((data) => {
      if (!data) {
        throw new Error("User not found");
      }
      return data;
    });
  return user;
}
