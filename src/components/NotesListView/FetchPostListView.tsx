import { useQuery } from "@tanstack/react-query";
import { fetchPostList } from "../../api/Post";
import { Loader } from "../Loader/";
import { NotesListView } from "./NotesListView";

export const FetchPostListView = () => {

  const postListQuery = useQuery<{ list: any[] }, Error>({ 
    queryFn: () => fetchPostList(),
    queryKey: ["posts"],
  });

  console.log("postListQuery.data", postListQuery.data);
  console.log("postListQuery.data.list", postListQuery?.data?.list);

  switch (postListQuery.status) {
    case "pending":
      return <Loader />;
    case "success":
      return <NotesListView notesList={postListQuery.data.list} />;
    case "error":
      return (
        <div>
          <span>Произошла ошибка:(</span>

        </div>
      );
  }
};