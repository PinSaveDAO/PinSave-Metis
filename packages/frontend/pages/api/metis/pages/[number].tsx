import { fetchDecodedPost } from "@/services/fetchCid";
import { getContractInfo } from "@/utils/contracts";

import type { NextApiRequest, NextApiResponse } from "next";
import { Contract, JsonRpcProvider } from "ethers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { number } = req.query;
    const pageNumber = Number(number);

    const { address, abi } = getContractInfo();

    const provider = new JsonRpcProvider(
      "https://andromeda.metis.io/?owner=1088"
    );

    const contract: Contract = new Contract(address, abi, provider);

    const totalSupply: number = Number(await contract.totalSupply());

    let items = [];
    let result;

    var upperLimit = 6 * pageNumber;

    const lowerLimit = upperLimit - 6 + 1;

    if (totalSupply < upperLimit) {
      upperLimit = totalSupply;
    }

    try {
      for (let i = lowerLimit; upperLimit >= i; i++) {
        result = await contract.getPostCid(i);
        console.log(result);
        const item = await fetchDecodedPost(result);
        console.log(item);
        items.push({ token_id: i, ...item });
      }
    } catch {
      res.status(200).json({ items: items, totalSupply: totalSupply });
    }
    res.status(200).json({ items: items, totalSupply: totalSupply });
  } catch (err) {
    res.status(500).json({ error: "failed to fetch data" + err });
  }
}
