import { User } from "../models/user.model.js";

interface LoginInput {
  email: string;
  password: string;
}

export async function loginService({ email, password }: LoginInput) {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.isPasswordCorrect(password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = await user.generateAccessToken();

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
      avatar: user.avatar,
    },
  };
}
