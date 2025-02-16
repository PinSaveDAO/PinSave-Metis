import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { fetchPosts, fetchPost } from "./queries";

export const usePosts = () => {
  return useInfiniteQuery({
    queryKey: ["metis"],
    queryFn: async ({ pageParam }: { pageParam?: number }) => {
      const data = await fetchPosts({ pageParam });
      return data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: any, pages: any) => {
      if (lastPage.items[5]?.tokenId < lastPage.totalSupply) {
        return pages.length + 1;
      }
    },
  });
};

export const usePost = (id: number, enabled: boolean) => {
  return useQuery({
    queryKey: [id],
    queryFn: () => fetchPost(id),
    enabled: enabled,
  });
};
