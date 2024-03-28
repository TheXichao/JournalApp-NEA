import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

interface Post {
  user_id: number;
  entry_id: number;
  creation_date: string;
  title: string;
  body: string;
}

export function useGetPostsAPI({
  path,
  token,
}: {
  path: string;
  token?: string | null;
}): { isLoading: boolean; error: any; posts: Post[] } {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);

      const headers: { [key: string]: string } = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Token ${token}`;
      }

      try {
        const response = await axios.get(`${API_URL}${path}`, { headers });
        const posts = response.data as Post[];
        setPosts(posts);
        console.log(posts);
      } catch (error: any) {
        if (axios.isCancel(error)) {
          return;
        }

        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [path]);

  return { isLoading, error, posts };
}
