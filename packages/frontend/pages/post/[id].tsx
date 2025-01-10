import type { GetStaticPaths, NextPage } from "next";
import { Contract, JsonRpcProvider } from "ethers";
import { ActionIcon, SimpleGrid } from "@mantine/core";
import { NextRouter, useRouter } from "next/router";
import { ArrowLeft } from "tabler-icons-react";

import MediaDetails from "@/components/Post/MediaDetails";
import DisplayMedia from "@/components/Post/DisplayMedia";
import { PageSEO } from "@/components/SEO";
import { fetchDecodedPost } from "@/services/fetchCid";
import { getContractInfo } from "@/utils/contracts";

interface Props {
  post: Post;
}

const PostPage: NextPage<Props> = ({ post }) => {
  const router: NextRouter = useRouter();
  const postId: string = String(post.tokenId);

  const tag: string = `Metis: ${postId}`;

  return (
    <div>
      <PageSEO
        title={`Pin Save Post ${tag}`}
        description={`Pin Save Post ${tag}`}
      />
      {post && (
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
            <DisplayMedia post={post} />
            <MediaDetails post={post} />
          </SimpleGrid>
        </div>
      )}
    </div>
  );
};

export default PostPage;

export const getStaticPaths = (async () => {
  const { address, abi } = getContractInfo();
  const provider = new JsonRpcProvider(
    "https://andromeda.metis.io/?owner=1088"
  );
  const contract: Contract = new Contract(address, abi, provider);
  const totalSupply: number = Number(await contract.totalSupply());

  const paths = Array.from({ length: totalSupply }, (_, i) => ({
    params: { id: String(totalSupply - i) },
  }));

  return {
    paths: paths,
    fallback: "blocking",
  };
}) satisfies GetStaticPaths;

type Post = {
  image: string;
  name: string;
  description: string;
  tokenId: number;
  owner: string;
  author: string;
  totalSupply: number;
};

export const getStaticProps = async (context: { params: { id: string } }) => {
  if (context) {
    const tokenId: number = Number(context.params.id);

    const { address, abi } = getContractInfo();
    const provider = new JsonRpcProvider(
      "https://metis-mainnet.public.blastapi.io"
    );
    const contract: Contract = new Contract(address, abi, provider);

    const totalSupply: number = Number(await contract.totalSupply());

    const result = await contract.getPostCid(tokenId);
    const item = await fetchDecodedPost(result, 500);
    const owner: string = await contract.getPostOwner(tokenId);
    const postAuthor: string = await contract.getPostAuthor(tokenId);
    const post: Post = {
      totalSupply: totalSupply,
      tokenId: tokenId,
      owner: owner,
      author: postAuthor,
      ...item,
    };

    return {
      props: {
        post,
      },
      revalidate: 20,
    };
  }
};
