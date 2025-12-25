import { UserModel } from "../models/user.model.js";
import { ApiError } from "@resume-buddy/utils";

interface SignupInput {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export async function signupService({ name, email, password, avatar }: SignupInput) {
  // Check if a user with the given email already exists
  const existingUser = await UserModel.exists({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const newUser = new UserModel({
    id: crypto.randomUUID(),
    name,
    email,
    password,
    ...(avatar && { avatar }), // only include avatar if provided else use default
  });

  // Save the new user to the database
  await newUser.save();

  const accessToken = await newUser.generateAccessToken();
  return {
    accessToken,
    user: {
      _id: newUser._id,
      name: newUser.name,
      role: newUser.role,
      email: newUser.email,
      avatar: newUser.avatar,
    },
  };
}
