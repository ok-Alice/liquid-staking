import { atom } from "jotai";
import { MockedData, Notification, Validator } from "@/types";

export const validatorsAtom = atom<Validator[]>([]);
export const notificationsAtom = atom<Notification[]>([]);

// mocked data
export const mockedDataAtom = atom<MockedData>({
  availableDOT: 1231.32,
  availableLDOT: 76.43534,
  DOTToLDOTExchangeRate: 1.424,
  LDOTToDOTExchangeRate: 0.899,
  DOTInFlight: 0,
  claimableDOT: 3.342,
});
