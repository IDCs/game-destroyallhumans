import { types } from 'vortex-api';

export type LockedState = 'true' | 'false' | 'always' | 'never';
export type LoadOrder = ILoadOrderEntry[];

export interface IProps {
  state: types.IState;
  api: types.IExtensionApi;
  profile: types.IProfile;
  discovery: types.IDiscoveryResult;
  mods: { [modId: string]: types.IMod };
}

export interface ISerializableData {
  prefix: string;
}

export interface ILoadOrderEntry<T = any> {
  id: string;
  enabled: boolean;
  name: string;
  locked?: LockedState;
  modId?: string;
  data?: T;
}
