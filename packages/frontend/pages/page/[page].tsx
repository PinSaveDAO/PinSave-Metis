import type { GetStaticPaths, NextPage } from "next";
import Link from "next/link";
import { Contract, JsonRpcProvider } from "ethers";
import { Box, Button, Center, Title } from "@mantine/core";

import PostCard from "@/components/Posts/PostCard";
import { PageSEO } from "@/components/SEO";
import { fetchDecodedPost } from "@/services/fetchCid";
import { getContractInfo } from "@/utils/contracts";

interface Props {
  posts: PostReduced[];
  hasNextPage: boolean;
  page: number;
}

type PostReduced = {
  image: string;
  name: string;
  tokenId: number;
};

const Home: NextPage<Props> = ({ posts, hasNextPage, page }) => {
  return (
    <div>
      <PageSEO />

      <Title order={1} className="fade-in-text">
        PinSave Page {page}
      </Title>

      <Box
        mx="auto"
        mt={20}
        sx={{
          maxWidth: 1500,
          gap: 20,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 5fr))",
          gridTemplateRows: "masonry",
        }}
      >
        {posts.map((post: PostReduced) => {
          return (
            <Center key={post.tokenId}>
              <PostCard post={post} />
            </Center>
          );
        })}
      </Box>
      <div>
        {hasNextPage ? (
          <Center mt={20}>
            <Link href={page === 1 ? "/" : `/page/${page - 1}`}>
              <Button mr={10}>Previous Page</Button>
            </Link>
            <Link href={`/page/${page + 1}`}>
              <Button>Next Page</Button>
            </Link>
          </Center>
        ) : (
          <Center mt={20}>
            <Link href={page === 1 ? "/" : `/page/${page - 1}`}>
              <Button>Previous Page</Button>
            </Link>
          </Center>
        )}
      </div>
    </div>
  );
};

export default Home;

export const getStaticPaths = (async () => {
  const { address, abi } = getContractInfo();
  const provider = new JsonRpcProvider(
    "https://andromeda.metis.io/?owner=1088"
  );
  const contract: Contract = new Contract(address, abi, provider);
  const totalSupply: number = Number(await contract.totalSupply());

  const pages: number = Math.floor(totalSupply / 24);

  const paths = Array.from({ length: pages }, (_, i) => ({
    params: { page: String(pages - i) },
  }));

  return {
    paths: paths,
    fallback: "blocking",
  };
}) satisfies GetStaticPaths;

export const getStaticProps = async (context: { params: { page: string } }) => {
  const page: number = Number(context.params.page);

  await new Promise((resolve) => setTimeout(resolve, 1000 * page));

  const { address, abi } = getContractInfo();

  let providerString;
  if (page % 2 === 0) {
    providerString = "https://metis-mainnet.public.blastapi.io";
  } else {
    providerString = process.env.NEXT_PUBLIC_ALCHEMY_METIS_SECOND;
  }
  const provider = new JsonRpcProvider(providerString);

  const contract: Contract = new Contract(address, abi, provider);

  const totalSupply: number = Number(await contract.totalSupply());
  const posts: PostReduced[] = [];

  const indexStart = page * 24 + 1;
  const indexEndNominal = indexStart + 23;

  let hasNextPage = true;

  let indexEnd = indexEndNominal;
  if (indexEndNominal >= totalSupply) {
    indexEnd = totalSupply;
    hasNextPage = false;
  }

  for (let i = indexStart; i <= indexEnd; i++) {
    const result: string = await contract.getPostCid(i);
    const post = await fetchDecodedPost(result, 150);
    await new Promise((resolve) => setTimeout(resolve, 100));
    posts.push({ image: post.image, name: post.name, tokenId: i });
  }
  return {
    props: {
      posts,
      hasNextPage,
      page,
    },
    revalidate: 60,
  };
};
