import { createContext, useContext, PropsWithChildren, useMemo } from "react";

import { PinataSDK } from "pinata";

type pinataContextType = {
  pinata: PinataSDK;
};

export const PinataContext = createContext<pinataContextType | undefined>(
  undefined
);

export const PinataProvider = ({ children }: PropsWithChildren<{}>) => {
  const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
  });

  const pinataProviderValue = useMemo(() => ({ pinata }), [pinata]);
  return (
    <PinataContext.Provider value={pinataProviderValue}>
      {children}
    </PinataContext.Provider>
 );
};

export const usePinatasContext = () => {
  const context = useContext(PinataContext);
  if (!context) {
    throw new Error("PinataContext must be used inside the PinataProvider");
  }
  return context;
};
