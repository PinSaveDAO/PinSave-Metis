import { ActionIcon, SimpleGrid, LoadingOverlay } from "@mantine/core";
import { NextRouter, useRouter } from "next/router";
import { ArrowLeft } from "tabler-icons-react";

import MediaDetails from "@/components/Post/MediaDetails";
import DisplayMedia from "@/components/Post/DisplayMedia";
import { PageSEO } from "@/components/SEO";
import { usePost } from "@/hooks/api";

const PostPage = () => {
  const router: NextRouter = useRouter();
  const postId: string = String(router.query.id);
  const orbisTag: string = `metis: ${postId}`;
  const { data: postQueried, isLoading } = usePost(postId);
  return (
    <div>
      <PageSEO
        title={`Pin Save Post ${orbisTag}`}
        description={`Pin Save Post ${orbisTag}`}
      />
      <LoadingOverlay visible={isLoading} />
      {postQueried && (
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
            <DisplayMedia post={postQueried} />
            <MediaDetails post={postQueried} orbisTag={orbisTag} />
          </SimpleGrid>
        </div>
      )}
    </div>
  );
};

export default PostPage;