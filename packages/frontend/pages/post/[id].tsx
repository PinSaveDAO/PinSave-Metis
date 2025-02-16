import type { NextPage } from "next";
import { Contract, JsonRpcProvider } from "ethers";
import { ActionIcon, SimpleGrid } from "@mantine/core";
import { NextRouter, useRouter } from "next/router";
import { ArrowLeft } from "tabler-icons-react";

import MediaDetails from "@/components/Post/MediaDetails";
import DisplayMedia from "@/components/Post/DisplayMedia";
import { PageSEO } from "@/components/SEO";
import { fetchDecodedPost } from "@/services/fetchCid";
import { getContractInfo } from "@/utils/contracts";
//import { usePinatasContext } from "@/context/index";
import { useEffect, useState } from "react";

type Post = {
  tokenId: number;
  owner: string;
  author: string;
  cid: string;
};

interface Props {
  post: Post;
}

type FullPost = {
  image: string;
  name: string;
  description: string;
  tokenId: number;
  owner: string;
  author: string;
};

const PostPage: NextPage<Props> = () => {
  const router: NextRouter = useRouter();
  const postId: string = String(router.query.id);

  const tag: string = `Metis: ${postId}`;

  const [postFull, setPost] = useState<FullPost>();

  useEffect(() => {
    async function fetchData() {
      const { address, abi } = getContractInfo();

      let providerString;

      providerString = process.env.NEXT_PUBLIC_ALCHEMY_METIS_FIRST;

      const provider: JsonRpcProvider = new JsonRpcProvider(providerString);
      const contract: Contract = new Contract(address, abi, provider);

      const cid: string = await contract.getPostCid(postId);
      const owner: string = await contract.getPostOwner(postId);
      const postAuthor: string = await contract.getPostAuthor(postId);
      const post: Post = {
        tokenId: Number(postId),
        owner: owner,
        author: postAuthor,
        cid: cid,
      };

      const item = await fetchDecodedPost(post.cid, 500);
      console.log(item);
      setPost({
        image: item.image,
        name: item.name,
        description: item.description,
        owner: post.owner,
        author: post.author,
        tokenId: post.tokenId,
      });
    }
    fetchData();
  }, [postId]);

  return (
    <div>
      <PageSEO
        title={`PinSave Post ${tag}`}
        description={`PinSave Post ${tag}`}
      />
      {postFull && (
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
            <DisplayMedia post={postFull} />
            <MediaDetails post={postFull} />
          </SimpleGrid>
        </div>
      )}
    </div>
  );
};

export default PostPage;
