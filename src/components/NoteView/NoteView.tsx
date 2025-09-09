import { FC } from "react";
import { Post } from "../../api/Post";
import "./NoteView.css";
import { useQueryClient } from '@tanstack/react-query';
import { deletePost } from "../../api/Post";

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface PostViewProps {
  post: Post;
}

export const NoteView: FC<PostViewProps> = ({ post }) => {
  const queryClient = useQueryClient();

 ({
    mutationFn: () => {
      console.log("Deleting note with ID:", post.id);
      return deletePost(post.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <div className="note-view">
      <div className="note-view__head">
        <p className="note-view__datetime">{formatDate(post.createdAt)}</p>
        <p className="note-view__title">{post.title}</p>
      </div>
      <p className="note-view__text">{post.text}</p>
       {/*<button onClick={() => deleteNote()} disabled={isPending}>
        {isPending ? 'Удаление...' : 'Удалить'}
    </button>*/}
    </div>
  );
};