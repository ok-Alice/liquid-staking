import { ApiPromise, WsProvider } from '@polkadot/api';

export async function connect(websocket: string): Promise<ApiPromise> {
  const provider = new WsProvider(websocket);
  return await ApiPromise.create({ provider: provider });
}
