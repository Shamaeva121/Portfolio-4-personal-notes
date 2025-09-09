import "./NoteForm.css";
import { FC } from "react";
import { queryClient } from '../../api/queryClient';
import { useMutation } from "@tanstack/react-query";
import { createPost } from "../../api/Post";
import { z } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '../Button';

const CreatePostSchema = z.object({
  title: z.string().min(5, "Заголовок должен содержать не менее 5 символов"),
  text: z.string().min(10, "Текст заметки должен содержать не менее 10 символов").max(300, "Текст заметки должен содержать не более 300 символов"),
});

type CreatePostForm = z.infer<typeof CreatePostSchema>;

interface NoteFormProps {
  userId: string;
  refetch: () => void;
}

const NoteForm: FC<NoteFormProps> = ({ userId, refetch }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreatePostForm>({
    resolver: zodResolver(CreatePostSchema),
    mode: "onSubmit", 
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostForm) => {
      const response = await createPost(data.title, data.text, userId); 
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response;
    },
    onError: (error: any) => { 
      console.error("Ошибка при создании заметки:", error);
    },
    onSuccess: (response) => {
      if (response.ok) {
        console.log("onSuccess called"); 
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        console.log("invalidateQueries called");
        refetch();
        console.log("refetch called"); 
        reset();
      } else {
        console.error("Ошибка при создании заметки:", response);
      }
    },
  });

  const onSubmit = (data: CreatePostForm) => {
    createPostMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="title">Заголовок:</label>
        <input type="text" id="title" {...register("title")} className={errors.title ? "error-input" : ""}/>
        {errors.title && <span className="error-message">{errors.title.message}</span>}
      </div>
      <div>
        <label htmlFor="text">Текст заметки:</label>
        <textarea id="text" {...register("text")} className={errors.text ? "error-input" : ""} />
        {errors.text && <span className="error-message">{errors.text.message}</span>}
      </div>
      {createPostMutation.isPending && <p>Создание заметки...</p>} 
      {createPostMutation.isError && <p>Ошибка: {createPostMutation.error?.message}</p>}
      {createPostMutation.isSuccess && <p>Заметка успешно создана!</p>}
      <Button  
          kind="primary" 
          type="submit" 
          isLoading={createPostMutation.isPending} 
      >
          Сохранить
      </Button>
    </form>
  );
};

export default NoteForm;

