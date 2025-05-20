export type Metadata = {
  description: string;
  name: string;
  symbol?: string;
  image?: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
};

export type IPAssetMetadata = {
  title: string;
  createdAt: string;
  ipType: "music";
  creators: {
    name: string;
    email: string;
    crossmintUserLocator: string;
    contributionPercent: number;
  }[];
  media: {
    name: string;
    url: string;
    mimeType: string;
  }[];
  attributes: {
    key: string;
    value: string;
  }[];
};

export type CreateCollectionParams = {
  metadata: Metadata;
  chain: "story-testnet" | "story";
};

export type CreateCollectionResponse = {
  id: string;
  actionId: string;
  metadata: Metadata;
  onChain: {
    chain: "story-testnet" | "story";
  };
};

export type CreateIPAssetParams = {
  owner: string;
  nftMetadata: Metadata;
  ipAssetMetadata: IPAssetMetadata;
};

export type CreateIPAssetResponse = {
  id: string;
  actionId: string;
  nftMetadata: Metadata;
  ipAssetMetadata: IPAssetMetadata;
  onChain: {
    status: string;
    chain: "story-testnet" | "story";
    contractAddress: string;
    ipAssetId: string;
    tokenId: string;
    txId: string;
    explorerLink: string;
  };
};

export type IPAsset = Omit<CreateIPAssetResponse, "actionId">;

export type Action = {
  id: string;
  status: string;
};
