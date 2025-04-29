import { Organization } from "next-auth";
import { create } from "zustand";

type AuthState = {
  Organization: Organization | null;
  setOrganization: (organization: Organization) => void;
};

const useAuthStore = create<AuthState>()((set) => ({
  Organization: null,
  setOrganization: (organization) =>
    set(() => ({ Organization: organization })), // Add this line
}));

export default useAuthStore;
