import { atom } from "jotai";
import { ExchangeRates, ChainBalance, Notification, Validator } from "@/types";

export const validatorsAtom = atom<Validator[]>([]);
export const notificationsAtom = atom<Notification[]>([]);

// mocked data
export const chainBalanceAtom = atom<ChainBalance>({
  availableDOT: 1231.32,
  availableLDOT: 76.43534,
  DOTInFlight: 0,
  claimableDOT: 3.342,
});

export const exchangeRatesAtom = atom<ExchangeRates>({
  DOTToLDOTExchangeRate: 1.424,
  LDOTToDOTExchangeRate: 0.899,
});
