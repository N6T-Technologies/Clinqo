import { atom } from "recoil";

export const sessionAtom = atom<string | null>({
    key: "sessionAtom",
    default: null,
});
