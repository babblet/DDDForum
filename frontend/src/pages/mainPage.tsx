import { Layout } from "../components/layout";
import { PostsList } from "../components/postsList";
import { PostsViewSwitcher } from "../components/postsViewSwitcher";
import { api } from "../api";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Post } from "../interfaces";

type PostRequestResponse = Awaited<ReturnType<typeof api.posts.getPosts>>;

const validatePostResponse = (response: PostRequestResponse) => {
  if (response.status !== 200 ||
      !response.data?.data ||
      !Array.isArray(response.data.data)
  ) {
    throw new Error("Failed to fetch posts");
  }
};

export const MainPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    api.posts.getPosts().then((response: PostRequestResponse) => {
      validatePostResponse(response);

      setPosts(response.data.data);
    }).catch((err: unknown) => {
      console.log(err);
      toast.error("Failed to fetch posts");
    });
  }, []);

  return (
    <Layout>
      <ToastContainer />
      <PostsViewSwitcher />
      <PostsList posts={posts} />
    </Layout>
  );
};
