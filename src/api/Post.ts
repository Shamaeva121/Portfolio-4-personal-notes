import { z } from "zod"
import { useEffect, useState } from "react"


export const PostSchema = z.object({
    id: z.string(),
    text: z.string(),
    userId: z.string(),
    createdAt: z.number(),
    title: z.string(),
});

export type Post = z.infer<typeof PostSchema>;

export const PostList = z.array(PostSchema);

export type PostList = z.infer<typeof PostList>

export const FetchPostListSchema = z.object({
    list: PostList,
})

type FetchPostListResponse = z.infer<typeof FetchPostListSchema>

async function validateResponse(response: Response): Promise<Response> {
    if (!response.ok) {
        try {
            const errorBody = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}, ${JSON.stringify(errorBody)}`);
        } catch (jsonError) {
            throw new Error(`HTTP error! Status: ${response.status}, Could not parse error body`);
        }
    }
    return response;
}

export function fetchPostList(): Promise<FetchPostListResponse> {
    console.log("fetchPostList function called");
    return fetch("/api/notes")  
        .then(validateResponse)
        .then((response) => response.json())
        .then((data) => {
            console.log("fetchPostList data", data); 
            return FetchPostListSchema.parse(data);
        });
}

interface IdleRequestState {
    status: "idle";
}

interface LoadingRequestState {
    status: "pending";
}

interface SuccessRequestState {
    status: "success";
    data: PostList;
}

interface ErrorRequestState {
    status: "error";
    error: unknown;
}

type RequestState =
    | IdleRequestState
    | LoadingRequestState
    | SuccessRequestState
    | ErrorRequestState;

export function UsePostList() {
    const [state, setState] = useState<RequestState>({ status: "idle" });

    useEffect(() => {
        if (state.status === "pending") {
            fetchPostList()  
                .then((data) => {
                   setState({ status: "success", data: data.list });
                })
                .catch((error) => {
                   setState({ status: "error", error });
                });
        }
    }, [state]);

    useEffect(() => {
        setState({ status: "pending" });
    }, []);

    const refetch = () => {
        setState({ status: "pending" })
    };

    return {
        state,
        refetch,
    }
}

export function createPost(title: string, text: string, userId: string): Promise<Response> {
    return fetch("/api/notes", {  
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            text,
            userId
        }),
    })
    .then(validateResponse)
}

export function deletePost(id: string): Promise<Response> {
    return fetch(`/api/notes/${id}`, {
        method: 'DELETE',
    }).then(validateResponse);
}