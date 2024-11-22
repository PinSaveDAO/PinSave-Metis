import type { NextApiRequest, NextApiResponse } from "next";
import { Contract, JsonRpcProvider } from "ethers";

import { ObjectJsonMetadata, fetchDecodedPost } from "@/services/fetchCid";
import { getContractInfo } from "@/utils/contracts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const { address, abi } = getContractInfo();

    const provider: JsonRpcProvider = new JsonRpcProvider(
      "https://andromeda.metis.io/?owner=1088"
    );

    const contract: Contract = new Contract(address, abi, provider);
    const postCid: string = await contract.getPostCid(id);

    const objectJsonMetadata: ObjectJsonMetadata =
      await fetchDecodedPost(postCid);

    const owner: string = await contract.getPostOwner(id);
    const postAuthor: string = await contract.getPostAuthor(id);

    res.status(200).json({
      ...objectJsonMetadata,
      author: postAuthor,
      owner: owner,
    });
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data" + err });
  }
}
