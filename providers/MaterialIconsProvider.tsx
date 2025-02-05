"use client";
import createEmotionCache from "@/lib/emotion-cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { PropsWithChildren } from "react";

const clientSideEmotionCache = createEmotionCache();

type MaterialIconsProviderProps = PropsWithChildren<object>;
const MaterialIconsProvider = ({ children }: MaterialIconsProviderProps) => {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <CssBaseline />
      {children}
    </CacheProvider>
  );
};

export default MaterialIconsProvider;
