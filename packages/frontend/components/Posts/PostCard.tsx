import { Paper, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/services/upload";

type PostReduced = {
  image: string;
  name: string;
  tokenId: number;
};

interface IMyProps {
  post: PostReduced;
}

const PostCard: React.FC<IMyProps> = ({ post }) => {
  return (
    <Link href={`/post/${post.tokenId}`}>
      <Paper
        component="div"
        withBorder
        radius="lg"
        shadow="md"
        p="md"
        sx={{ cursor: "pointer" }}
      >
        <Image
          src={post.image}
          alt={post.name}
          height={200}
          width={200}
          sizes="200px"
          style={{ objectFit: "cover", borderRadius: "10px" }}
        />
        <Text
          align="center"
          mt="sm"
          lineClamp={1}
          style={{
            width: 200,
          }}
        >
          {post.name}
        </Text>
      </Paper>
    </Link>
  );
};

export default PostCard;
