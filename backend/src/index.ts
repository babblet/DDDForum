import express from "express";
import type { Request, Response } from "express";

import { database } from "./database";
import type { User } from "./database";

// Errors that can be returned by the API
enum Errors {
  UsernameAlreadyTaken = "UserNameAlreadyTaken",
  EmailAlreadyInUse = "EmailAlreadyInUse",
  ValidationError = "ValidationError",
  ServerError = "ServerError",
  ClientError = "ClientError",
  UserNotFound = "UserNotFound",
}

// Used HTTP Status Codes in this API
enum HTTPStatusCodes {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500,
}

// We do not care about the passwords right now, so we can generate a random password
function generateRandomPassword(length: number): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const passwordArray = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    passwordArray.push(charset[randomIndex]);
  }

  return passwordArray.join("");
}

// We don't want to return the password within the request
function parseUserForResponse(user: User) {
  const returnData = JSON.parse(JSON.stringify(user));
  delete returnData.password;
  return returnData;
}

const app = express();
const cors = require('cors')
app.use(express.json());
app.use(cors({
  origin: '*' // Allow all origins for dev
}))

// Create a new user
app.post("/users/new", async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    // Check if the user data is valid
    if (
      !userData.email ||
      !userData.username ||
      !userData.firstName ||
      !userData.lastName
    ) {
      return res.status(HTTPStatusCodes.BadRequest).json({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
    }

    // Check if the user exists by email or not
    const existingUserByEmail = await database.user.findFirst({
      where: { email: userData.email },
    });
    if (existingUserByEmail) {
      return res.status(HTTPStatusCodes.Conflict).json({
        error: Errors.EmailAlreadyInUse,
        data: undefined,
        success: false,
      });
    }

    // Check if the user exists by username or not
    const existingUserByUsername = await database.user.findFirst({
      where: { username: userData.username },
    });
    if (existingUserByUsername) {
      return res.status(HTTPStatusCodes.Conflict).json({
        error: Errors.UsernameAlreadyTaken,
        data: undefined,
        success: false,
      });
    }

    const user = await database.user.create({
      data: { ...userData, password: generateRandomPassword(10) },
    });

    return res.status(HTTPStatusCodes.Ok).json({
      error: undefined,
      data: parseUserForResponse(user),
      success: true,
    });
  } catch (error) {
    // Return a failure error response
    return res.status(HTTPStatusCodes.InternalServerError).json({
      error: "ServerError",
      data: undefined,
      success: false,
    });
  }
});

// Edit a user
app.post("/users/edit/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      return res.status(HTTPStatusCodes.BadRequest).json({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
    }

    // Check if user exists
    const userToEdit = await database.user.findUnique({ where: { id: userId } });
    if (!userToEdit) {
      return res
        .status(HTTPStatusCodes.NotFound)
        .json({ error: Errors.UserNotFound, data: undefined, success: false });
    }

    const postedUserData = req.body;

    // Check if the user data is valid
    if (
      !postedUserData.email ||
      !postedUserData.username ||
      !postedUserData.firstName ||
      !postedUserData.lastName
    ) {
      return res.status(HTTPStatusCodes.BadRequest).json({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
    }

    // Check if a user with the new email exists
    const existingUserByEmail = await database.user.findFirst({
      where: {
        email: postedUserData.email,
        id: {
          not: userId, // Exclude the current user
        },      
      },
    });
    if (existingUserByEmail) {
      return res.status(HTTPStatusCodes.Conflict).json({
        error: Errors.EmailAlreadyInUse,
        data: undefined,
        success: false,
      });
    }

    // Check if a user with the new username exists
    const existingUserByUsername = await database.user.findFirst({
      where: {
        username: postedUserData.username,
        id: {
          not: userId // Exclude the current user
        }
      },
    });
    if (existingUserByUsername) {
      return res.status(HTTPStatusCodes.Conflict).json({
        error: Errors.UsernameAlreadyTaken,
        data: undefined,
        success: false,
      });
    }

    const updatedUser: User = await database.user.update({
      where: { id: userToEdit.id },
      data: postedUserData,
    });

    return res.status(HTTPStatusCodes.Ok).json({
      error: undefined,
      data: parseUserForResponse(updatedUser),
      success: true,
    });
  } catch (error) {
    // Return a failure error response
    return res.status(HTTPStatusCodes.InternalServerError).json({
      error: "ServerError",
      data: undefined,
      success: false,
    });
  }
});

// Get a user by email
app.get("/users", async (req: Request, res: Response) => {
  try {
    const userEmailFromParams = req.query.email as string;

    // Check that the email is not empty
    if (!userEmailFromParams) {
      return res.status(HTTPStatusCodes.BadRequest).json({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
    }

    // Check if user exists
    const userFoundByEmail = await database.user.findFirst({ where: { email: userEmailFromParams } });
    if (!userFoundByEmail) {
      return res
        .status(HTTPStatusCodes.NotFound)
        .json({ error: Errors.UserNotFound, data: undefined, success: false });
    }

    return res.status(HTTPStatusCodes.Ok).json({
      error: undefined,
      data: parseUserForResponse(userFoundByEmail),
      success: true,
    });
  } catch (error) {
    // Return a failure error response
    return res.status(HTTPStatusCodes.InternalServerError).json({
      error: "ServerError",
      data: undefined,
      success: false,
    });
  }
});

app.get('/posts', async (req: Request, res: Response) => {
  try {
    const { sort } = req.query;
    
    if (sort !== 'recent') {
      return res.status(HTTPStatusCodes.BadRequest).json({ error: Errors.ClientError, data: undefined, success: false })
    } 
  
    let postsWithVotes = await database.post.findMany({
      include: {
        upVotes: true, // Include associated votes for each post
        downVotes: true,
        author: {
          include: {
            user: true
          }
        },
        comments: true
      },
      orderBy: {
        dateCreated: 'desc', // Sorts by dateCreated in descending order
      },
    });

    return res.json({ error: undefined, data: postsWithVotes, success: true });
  } catch (error) {
    return res.status(HTTPStatusCodes.InternalServerError).json({ error: Errors.ServerError, data: undefined, success: false });
  }
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
