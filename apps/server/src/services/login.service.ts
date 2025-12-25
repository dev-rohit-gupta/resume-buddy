import { User } from "../models/user.model.js";
import { ApiError } from "@resume-buddy/utils";

interface LoginInput {
  email: string;
  password: string;
}

export async function loginService({ email, password }: LoginInput) {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await user.isPasswordCorrect(password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = await user.generateAccessToken();

  return {
    accessToken,
    user: {
      _id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
      avatar: user.avatar,
    },
  };
}
