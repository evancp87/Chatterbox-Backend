/* eslint-disable no-console */
import { handleAuthValidation } from "../lib/validation";
import { Request, Response } from "express";
// import { highlight, greenHighlight } from "../lib/chalkThemes";
// import { TUser } from "../types/types";
import { supabase } from "../config";
import dotenv from "dotenv";
import { Users, users } from "../schema";
import { db } from "../db";
// import { eq } from "drizzle-orm";
dotenv.config();

const loginUser = async (req: Request, res: Response) => {
  const validationSentResponse = await handleAuthValidation(req, res);
  if (validationSentResponse) {
    return;
  }
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Authentication error:", error.message);
      res.status(401).send(error.message);
      return;
    }
    res.status(200).send({
      id: data.user?.id,
      email: data.user?.email,
    });
  } catch (error) {
    console.error("There was an error:", error);
    res.status(500).json(error);
  }
};

const registerUser = async (req: Request, res: Response) => {
  const validationSentResponse = await handleAuthValidation(req, res);
  if (validationSentResponse) {
    return;
  }

  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      // username,
      password,
    });

    if (error) {
      console.error("Authentication error:", error.message);
      res.status(401).send(error.message);
      return;
    }

    await db.insert(users).values({
      email,
      password,
    });
    res.status(201).json({
      id: data.user?.id,
      email: data.user?.email,
    });
  } catch (error) {
    console.error("There was an error:", error);
    res.status(500).json(error);
  }
};

const setAvatar = async (req: Request, res: Response) => {};

const setUsername = async (req: Request, res: Response) => {};

const setEmoji = async (req: Request, res: Response) => {};

const googleSignIn = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        redirectTo: "http://localhost:3000/chats",
      },
    });

    if (error) {
      console.error("Authentication error:", error.message);
      res.status(401).send(error.message);
      return;
    }
    // const { email, password } = data.user;

    // // Check if the user already exists in your database
    // let user: Users | null = await db.select(users).where({ github_id: id }).first();

    // if (!user) {
    //   // If the user does not exist, create a new user record
    //   user = await db.insert(users).values({
    //     google_id: id,
    //     email,
    //     name,
    //     avatar_url,
    //     // Add other fields as necessary
    //   }).returning('*').execute();
    // }

    res.status(200).send("Logged in with Google");
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .send({ message: "Error during Google sign-in", error: error.message });
    } else {
      res
        .status(500)
        .send({ message: "An unknown error occurred during Google sign-in" });
    }
  }
};

const githubSignIn = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/chats",
      },
    });

    if (error) {
      console.error("Authentication error:", error.message);
      res.status(401).send(error.message);
      return;
    }
    // const { id, email, name, avatar_url } = data.user;

    // // Check if the user already exists in your database
    // let user: Users | null = await db.select(users).where({ github_id: id }).first();

    // if (!user) {
    //   // If the user does not exist, create a new user record
    //   user = await db.insert(users).values({
    //     github_id: id,
    //     email,
    //     name,
    //     avatar_url,
    //     // Add other fields as necessary
    //   }).returning('*').execute();
    // }

    res.status(200).send("Logged in with Google");
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .send({ message: "Error during Google sign-in", error: error.message });
    } else {
      res
        .status(500)
        .send({ message: "An unknown error occurred during Google sign-in" });
    }
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    const { error } = await supabase.auth.signOut({ scope: "global" });
    if (error) {
      console.error("Authentication error:", error.message);
      res.status(401).send(error.message);
      return;
    }

    res.status(200).send("signed out");
  } catch (error) {
    console.error("There was an errorlogging out", error);
    res.status(500).send(error);
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const validationSentResponse = await handleAuthValidation(req, res);
  if (validationSentResponse) {
    return;
  }
  const { email } = req.body;

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/update",
    });
    if (error) {
      console.error("Error sending password reset email:", error.message);
      res.status(400).send(error.message);
      return;
    }
    res.status(200).send("Password reset email sent");
  } catch (error) {
    if (error instanceof Error)
      if ("message" in error) {
        console.error("Error sending password reset email:", error.message);
        res.status(500).send(error.message);
      }
  }
};

const updatePassword = async (req: Request, res: Response) => {
  const { newPassword } = req.body;

  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      console.error("Error updating password:", error.message);
      res.status(400).send(error.message);
      return;
    }
    // TODO: finish setting new password
    // const id = await db.users.findFirst({ with: {

    // } });
    // await db
    //   .update(users)
    //   .set({ password: newPassword })
    //   .where(eq(users.id, id));

    res.status(200).send("Password updated successfully");
  } catch (error) {
    if (error instanceof Error)
      if ("message" in error) {
        console.error("Error updating password", error.message);
        res.status(500).send(error.message);
      }
  }
};

const initiateOtpSignIn = async (req: Request, res: Response) => {
  const validationSentResponse = await handleAuthValidation(req, res);

  if (validationSentResponse) {
    return;
  }
  const { email } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });
    if (error) {
      console.error("Error signing in:", error.message);
      res.status(400).send(error.message);
      return;
    }

    res.status(200).send("Check your email for the login");
  } catch (error) {
    if (error instanceof Error)
      if ("message" in error) {
        console.error("Error sending login email:", error.message);
        res.status(500).send(error.message);
      }
  }

  // https://supabase.com/docs/guides/auth/passwordless-login/auth-email-otp
};

const verifyOtp = async (req: Request, res: Response) => {
  const validationSentResponse = await handleAuthValidation(req, res);
  if (validationSentResponse) {
    return;
  }
  const { email, otp } = req.body;

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      console.error("Error verifying OTP:", error.message);
      res.status(400).send(error.message);
      return;
    }
    res.status(200).send(data);
  } catch (error) {
    if (error instanceof Error)
      if ("message" in error) {
        console.error("Error verifying one time password:", error.message);
        res.status(500).send(error.message);
      }
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error("Error refreshing token:", error.message);

      res.status(400).send(error.message);
      return;
    }
    const { session } = data;
    const access_token = session?.access_token;
    res.status(200).send({ access_token });
  } catch (error) {
    if (error instanceof Error)
      if ("message" in error) {
        console.error("Error refreshing token:", error.message);
        res.status(500).send(error.message);
      }
  }
};

// const multiFactorAuthentication = async (req: Request, res: Response) => {}
// https://supabase.com/docs/guides/auth/auth-mfa

// TODO ORM schema
const friendsList = () => {};
const friend = () => {};

export {
  registerUser,
  loginUser,
  logoutUser,
  friendsList,
  friend,
  verifyOtp,
  resetPassword,
  updatePassword,
  initiateOtpSignIn,
  githubSignIn,
  googleSignIn,
  refreshToken,
};
