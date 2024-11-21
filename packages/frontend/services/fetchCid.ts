import { parseCidIpfsIo, parseCidPinata } from "@/services/parseCid";

export type ObjectJsonMetadata = {
  name: string;
  description: string;
  image: string;
};

export async function fetchJson(resURL: string, resURL2: string) {
  let item;
  try {
    item = await fetch(resURL).then((x) => x.json());
  } catch (e) {
    console.log("fetchJson error 1", e);
    try {
      item = await fetch(resURL2).then((x) => x.json());
    } catch (e) {
      console.log("fetchJson error 2", e);
    }
  }
  console.log("item", item);
  return item;
}

export async function fetchWorkingImageUrl(resURL1: string, resURL2: string) {
  const image: string = "https://pinsave.app/PinSaveCard.png";

  const res1: Response = await fetch(resURL1);
  const headersRes1: string | null = res1.headers.get("content-type");
  if (headersRes1 === "text/html") {
    const lastIndex = resURL1.lastIndexOf("/");
    const constPart = resURL1.substring(0, lastIndex);
    const toUpdatePart = resURL1.substring(lastIndex);
    const updatedPart = toUpdatePart.replace("#", "%23");
    const newResURL1 = constPart + updatedPart;
    const updatedRes1: Response = await fetch(newResURL1);
    const newHeadersRes1: string | null = res1.headers.get("content-type");
    console.log(newHeadersRes1);
    if (updatedRes1.status === 200) return newResURL1;
  }

  if (res1.status === 200) return resURL1;

  const res2: Response = await fetch(resURL2);
  if (res2.status === 200) return resURL2;
  return image;
}

export async function parseString(result: string) {
  if (result.charAt(0) === "i") {
    const cidIpfsIo: string = parseCidIpfsIo(result);
    const cidPinata: string = parseCidPinata(result);
    return [cidIpfsIo, cidPinata];
  }
  throw new Error(`${result}: no ipfs link`);
}

export async function fetchMetadata(
  cidMetadata: string
): Promise<ObjectJsonMetadata> {
  const [resIpfsIo, resPinata] = await parseString(cidMetadata);
  const objectJsonMetadata: ObjectJsonMetadata = await fetchJson(
    resIpfsIo,
    resPinata
  );
  return objectJsonMetadata;
}

export async function fetchImage(cidImage: string) {
  const [resURL, resURL2] = await parseString(cidImage);
  const linkImage: string = await fetchWorkingImageUrl(resURL, resURL2);
  return linkImage;
}

export async function fetchDecodedPost(cidMetadata: string) {
  try {
    const objectJsonMetadata: ObjectJsonMetadata =
      await fetchMetadata(cidMetadata);

    try {
      const decodedImage: string = await fetchImage(objectJsonMetadata.image);
      const output = {
        ...objectJsonMetadata,
        image: decodedImage,
      };
      return output;
    } catch (e) {
      return {
        ...objectJsonMetadata,
        image: "/fail.webp",
      };
    }
  } catch (e) {
    return {
      name: "Failed",
      description: "F for Failure",
      image: "/fail.webp",
    };
  }
}
