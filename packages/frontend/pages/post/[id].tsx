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

const PostPage: NextPage<Props> = ({ post }) => {
  const router: NextRouter = useRouter();
  const postId: string = String(post.tokenId);

  const tag: string = `Metis: ${postId}`;

  const [postFull, setPost] = useState<FullPost>();

  useEffect(() => {
    async function fetchData() {
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
  }, [post]);

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

export const getStaticPaths = async () => {
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
};

type Post = {
  tokenId: number;
  owner: string;
  author: string;
  cid: string;
  /*   name: string;
  description: string;
  image: string; */
};

export const getStaticProps = async (context: { params: { id: string } }) => {
  if (context) {
    const tokenId: number = Number(context.params.id);

    const { address, abi } = getContractInfo();

    let providerString;

    if (tokenId % 2 === 0) {
      providerString = process.env.NEXT_PUBLIC_ALCHEMY_METIS_FIRST;
    } else {
      providerString = process.env.NEXT_PUBLIC_ALCHEMY_METIS_SECOND;
    }

    const provider: JsonRpcProvider = new JsonRpcProvider(providerString);
    const contract: Contract = new Contract(address, abi, provider);

    const cid: string = await contract.getPostCid(tokenId);
    //const item = await fetchDecodedPost(cid, 500);
    const owner: string = await contract.getPostOwner(tokenId);
    const postAuthor: string = await contract.getPostAuthor(tokenId);
    const post: Post = {
      tokenId: tokenId,
      owner: owner,
      author: postAuthor,
      cid: cid,
    };

    return {
      props: {
        post,
      },
      revalidate: 20,
    };
  }
};
