export type Validator = {
  address: string;
  identity: ValidatorIdentity;
  staked: EraStaked;
  eraPoints: EraPoints[];
};

export type EraStaked = {
  own: string;
  total: string;
};

export type EraPoints = {
  era: number;
  points: number;
};

export type ValidatorIdentity = {
  display: string | undefined;
  parent: string | undefined;
  email: string | undefined;
  legal: string | undefined;
  web: string | undefined;
  riot: string | undefined;
  twitter: string | undefined;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  duration?: number;
};

export type MockedData = {
  availableDOT: number;
  availableLDOT: number;
  DOTToLDOTExchangeRate: number;
  LDOTToDOTExchangeRate: number;
  DOTInFlight: number;
  claimableDOT: number;
};
