import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

import { SignJWT } from "jose";

const encoder = new TextEncoder();

export interface IUser extends Document {
  name: string;
  id: string;
  email: string;
  password: string; // optional (future)
  role: "user" | "admin";
  avatar: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      select: false, // important
      unique: false,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "https://ui-avatars.com/api/?name=user&background=0D8ABC&color=fff",
    },
  },
  { timestamps: true }
);

/*------------ middleware for password hashing ------------- */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = async function () {
  const secret = encoder.encode(
    process.env.ACCESS_TOKEN_SECRET!
  );

  return await new SignJWT({
    id: this._id.toString(),
    role: this.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(
      process.env.ACCESS_TOKEN_EXPIRY ?? "7d"
    )
    .sign(secret);
};

export const User = mongoose.model<IUser>("User", UserSchema);
