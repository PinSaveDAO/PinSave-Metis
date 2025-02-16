export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_PINATA_JWT: string;
      NEXT_PUBLIC_GATEWAY_URL: string;
      NEXT_PUBLIC_WALLETCONNECT_ID: string;
      NEXT_PUBLIC_ALCHEMY_MAINNET: string;
      NEXT_PUBLIC_ALCHEMY_METIS_FIRST: string;
      NEXT_PUBLIC_ALCHEMY_METIS_SECOND: string;
      ENV: "test" | "dev" | "prod";
    }
  }
}
