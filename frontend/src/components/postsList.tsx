import { Link } from "react-router-dom";
import arrow from "../assets/arrow.svg";
import moment from 'moment';
import type { Post } from "../interfaces";

function computeVoteCount(post: Post) {
  return post.upVotes.length - post.downVotes.length;
}

export const PostsList = ({ posts }: { posts: Post[] }) => (
  <div className="posts-list">
    {posts.map((post: Post, key) => (
      <div className="post-item" key={key}>
        <div className="post-item-votes">
          <div className="post-item-upvote">
            <img src={arrow} />
          </div>
          <div>{computeVoteCount(post)}</div>
          <div className="post-item-downvote">
            <img src={arrow} />
          </div>
        </div>
        <div className="post-item-content">
          <div className="post-item-title">{post.title}</div>
          <div className="post-item-details">
          <div>{moment(post.dateCreated).fromNow()}</div>
          <Link to={`/member/${post.author.user.username}`}>
            by {post.author.user.username}
          </Link>
          <div>
            {post.comments.length}{" "}
            {post.comments.length !== 1 ? `comments` : "comment"}
          </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);