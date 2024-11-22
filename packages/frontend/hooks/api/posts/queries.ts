import fetcher from "@/utils/fetcher";

export const fetchPosts = async ({
  pageParam = 1,
}: { pageParam?: number } = {}) => {
  try {
    const apiRoute: string = `/api/metis/pages/${pageParam}`;
    return await fetcher(apiRoute);
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const fetchPost = async (id: string) => {
  try {
    return await fetcher(`/api/metis/posts/${id}`);
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};
