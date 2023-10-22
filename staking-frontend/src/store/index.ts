import { atom } from "jotai";
import { Validator } from "@/types";

export const validatorsAtom = atom<Validator[]>([]);
