import { User, Post, PostUpVote, PostDownVote, Comment } from "@prisma/client";
import { database } from "../src/database";

const initialUsers: User[] = [
  {
    id: 1,
    email: "bobvance@gmail.com",
    firstName: "Bob",
    lastName: "Vance",
    username: "bobvance",
    password: "123",
  },
  {
    id: 2,
    email: "tonysoprano@gmail.com",
    firstName: "Tony",
    lastName: "Soprano",
    username: "tonysoprano",
    password: "123",
  },
  {
    id: 3,
    email: "billburr@gmail.com",
    firstName: "Bill",
    lastName: "Burr",
    username: "billburr",
    password: "123",
  },
];

const initialMemberUserIds = [
  { memberId: 1, userId: 1 },
  { memberId: 2, userId: 2 },
  { memberId: 3, userId: 3 },
];

const initialPosts: Post[] = [
  {
    id: 1,
    title: "First post!",
    content: "This is bob vances first post",
    postType: "Text",
    dateCreated: new Date(),
    memberId: 1,
  },
  {
    id: 2,
    title: "Second post!",
    content: "This is bobs second post",
    postType: "Text",
    dateCreated: new Date(),
    memberId: 1,
  },
  {
    id: 3,
    title: "another post",
    content: "This is tonys first post",
    postType: "Text",
    dateCreated: new Date(),
    memberId: 2,
  },
  {
    id: 4,
    title: "Links",
    content: "This is a link post",
    postType: "<https://khalilstemmler.com>",
    dateCreated: new Date(),
    memberId: 2,
  },
];

const initialPostUpVotes: PostUpVote[] = [
  // Everyone upvotes their own first post
  { id: 1, postId: 1, memberId: 1 },
  { id: 2, postId: 2, memberId: 1 },
  { id: 3, postId: 3, memberId: 2 },
  { id: 4, postId: 4, memberId: 2 },
  // Tony's post upvoted by Bob
  { id: 5, postId: 3, memberId: 1 },
  // Bob's second post downvoted by Bill
  { id: 6, postId: 2, memberId: 3 },
];

const initialPostDownVotes: PostDownVote[] = []

const initialPostComments: Comment[] = [
  {
    id: 1,
    content: "I posted this!",
    memberId: 1,
    postId: 1,
    parentCommentId: null,
  },
  { id: 2, content: "Nice", memberId: 2, postId: 2, parentCommentId: null },
];

async function seed() {
  for (const user of initialUsers) {
    const newUser = await database.user.create({
      data: user,
    });

    await database.member.create({
      data: {
        user: {
          connect: { id: newUser.id },
        },
      },
    });
  }

  for (const post of initialPosts) {
    await database.post.create({
      data: post,
    });
  }

  for (const vote of initialPostUpVotes) {
    await database.postUpVote.create({
      data: vote,
    });
  }

  for (const vote of initialPostDownVotes) {
    await database.postDownVote.create({
      data: vote,
    });
  }

  for (const comment of initialPostComments) {
    await database.comment.create({
      data: comment,
    });
  }
}

seed();
