import type { NextPage } from "next";
import { ActionIcon, SimpleGrid } from "@mantine/core";
import { NextRouter, useRouter } from "next/router";
import { ArrowLeft } from "tabler-icons-react";

import MediaDetails from "@/components/Post/MediaDetails";
import DisplayMedia from "@/components/Post/DisplayMedia";
import { PageSEO } from "@/components/SEO";
import { usePost } from "@/hooks/api";

type Post = {
  tokenId: number;
  owner: string;
  author: string;
  cid: string;
};

interface Props {
  post: Post;
}

const PostPage: NextPage<Props> = () => {
  const router: NextRouter = useRouter();
  const postId: number = Number(router.query.id);

  const tag: string = `Metis: ${postId}`;

  const { data, isFetched } = usePost(postId, !!postId);

  return (
    <div>
      <PageSEO
        title={`PinSave Post ${tag}`}
        description={`PinSave Post ${tag}`}
      />
      {isFetched && (
        <div>
          <ActionIcon
            onClick={() => router.back()}
            mb="md"
            color="teal"
            size="xl"
            radius="xl"
            variant="filled"
          >
            <ArrowLeft />
          </ActionIcon>
          <SimpleGrid
            breakpoints={[
              { minWidth: "md", cols: 2, spacing: "lg" },
              { maxWidth: "md", cols: 1, spacing: "md" },
            ]}
          >
            <DisplayMedia post={data} />
            <MediaDetails post={data} />
          </SimpleGrid>
        </div>
      )}
    </div>
  );
};

export default PostPage;
