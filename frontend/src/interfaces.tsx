export type UpVote = { id: number, postId: number };
export type DownVote = { id: number, postId: number };
export type Comment = {};
export type User = { username: string };

// Define the shape of your user data
export interface UserData {
  username: string;
  // ... other relevant user data
}

export type Post = {
  title: string;
  dateCreated: string;
  author: { user: { username: string } };
  comments: Comment[];
  upVotes: UpVote[];
  downVotes: DownVote[];
};

export type RegistrationInput = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
};
