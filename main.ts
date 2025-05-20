import { load } from "jsr:@std/dotenv";
import type {
  Action,
  CreateCollectionParams,
  CreateCollectionResponse,
  CreateIPAssetParams,
  CreateIPAssetResponse,
  IPAsset,
} from "./types.ts";

await load({ export: true });

const serverApiKey = Deno.env.get("SERVER_API_KEY");

if (!serverApiKey) {
  throw new Error("SERVER_API_KEY is not set");
}

const getAction = async (actionId: string) => {
  const response = await fetch(
    `https://staging.crossmint.com/api/v1/ip/actions/${actionId}`,
    {
      method: "GET",
      headers: {
        "X-API-KEY": serverApiKey,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to get action: ${JSON.stringify(errorData)}`);
  }

  return response.json() as Promise<Action>;
};

const createCollection = async (params: CreateCollectionParams) => {
  const response = await fetch(
    "https://staging.crossmint.com/api/v1/ip/collections",
    {
      method: "POST",
      headers: {
        "X-API-KEY": serverApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to create collection: ${JSON.stringify(errorData)}`,
    );
  }

  return response.json() as Promise<CreateCollectionResponse>;
};

const createIPAsset = async (
  collectionId: string,
  params: CreateIPAssetParams,
) => {
  const response = await fetch(
    `https://staging.crossmint.com/api/v1/ip/collections/${collectionId}/ipassets`,
    {
      method: "POST",
      headers: {
        "X-API-KEY": serverApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create IP asset: ${JSON.stringify(errorData)}`);
  }

  return response.json() as Promise<CreateIPAssetResponse>;
};

const getIPAsset = async (collectionId: string, ipAssetId: string) => {
  const response = await fetch(
    `https://staging.crossmint.com/api/v1/ip/collections/${collectionId}/ipassets/${ipAssetId}`,
    {
      method: "GET",
      headers: {
        "X-API-KEY": serverApiKey,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to get IP asset: ${JSON.stringify(errorData)}`);
  }

  return response.json() as Promise<IPAsset>;
};

// script starts here
console.log("Starting script...");

console.log("Creating collection...");
const collection = await createCollection({
  metadata: {
    description: "Junglenauts",
    name: "Tranquil Wildfire",
    symbol: "JW",
  },
  chain: "story-testnet",
});

console.log("Collection created:", collection.id);
console.log(JSON.stringify(collection, null, 2));

console.log("Creating IP asset...");
const newIPAsset = await createIPAsset(collection.id, {
  owner: "email:robin@crossmint.com:story-testnet",
  nftMetadata: {
    name: "Tranquil Wildfire",
    description: "jungle drum n bass, resembling peace and concentration",
    image:
      "https://cdn2.suno.ai/image_6d6e1819-9ef0-4f1b-90f8-c385bf36a64c.jpeg",
  },
  ipAssetMetadata: {
    title: "Tranquil Wildfire",
    createdAt: new Date().toISOString(),
    ipType: "music",
    creators: [
      {
        name: "Robin",
        email: "robin@crossmint.com",
        crossmintUserLocator: "email:robin@crossmint.com:story-testnet",
        contributionPercent: 75,
      },
      {
        name: "Jorge",
        email: "jorge@crossmint.com",
        crossmintUserLocator: "email:jorge@crossmint.com:story-testnet",
        contributionPercent: 25,
      },
    ],
    media: [
      {
        name: "Tranquil Wildfire",
        url: "https://cdn1.suno.ai/6d6e1819-9ef0-4f1b-90f8-c385bf36a64c.mp3",
        mimeType: "audio/mpeg",
      },
    ],
    attributes: [
      {
        key: "Genre",
        value: "Jungle Drum and Bass",
      },
      {
        key: "Style",
        value: "Ambient, Chillout",
      },
    ],
  },
});

console.log("IP asset created:", newIPAsset.id);
console.log(JSON.stringify(newIPAsset, null, 2));

console.log("Getting action status...");
let attempts = 0;
const maxAttempts = 40;
const timeoutMs = 2000; // 2 seconds between retries

let action = await getAction(newIPAsset.actionId);
while (action.status === "pending" && attempts < maxAttempts) {
  console.log(`Action still pending. Attempt ${attempts + 1}/${maxAttempts}`);
  await new Promise((resolve) => setTimeout(resolve, timeoutMs));
  action = await getAction(newIPAsset.actionId);
  attempts++;
}

if (action.status === "pending") {
  console.log("Max attempts reached. Action still pending.");
}

console.log(JSON.stringify(action, null, 2));

console.log("Getting IP asset...");
const ipAsset = await getIPAsset(collection.id, newIPAsset.id);
console.log(JSON.stringify(ipAsset, null, 2));

console.log("End of script");
