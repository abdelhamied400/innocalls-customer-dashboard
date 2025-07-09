import { ExtensionWithCredentials } from "@/types/api/extension";
import { create } from "zustand";

type Webrtc = {
  extension: ExtensionWithCredentials | null;
  setExtension: (ext: ExtensionWithCredentials | null) => void;
};

const useWebrtcStore = create<Webrtc>()((set) => ({
  extension: null,
  setExtension: (ext: ExtensionWithCredentials | null) =>
    set({ extension: ext }),
}));

export default useWebrtcStore;
