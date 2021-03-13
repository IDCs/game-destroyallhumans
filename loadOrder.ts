import { fs, types, util } from 'vortex-api';

import { GAME_ID } from './common';
import { ILoadOrderEntry, IProps, ISerializableData, LoadOrder } from './types';
import { ensureLOFile, genProps, makePrefix } from './util';

export async function serialize(context: types.IExtensionContext,
                                loadOrder: LoadOrder): Promise<void> {
  const props: IProps = genProps(context);
  if (props === undefined) {
    return Promise.reject(new util.ProcessCanceled('invalid props'));
  }

  const loFilePath = await ensureLOFile(context);
  const prefixedLO = loadOrder.map((loEntry: ILoadOrderEntry, idx: number) => {
    const prefix = makePrefix(idx);
    const data: ISerializableData = {
      prefix,
    };
    return { ...loEntry, data };
  });

  await fs.removeAsync(loFilePath).catch({ code: 'ENOENT' }, () => Promise.resolve());
  await fs.writeFileAsync(loFilePath, JSON.stringify(prefixedLO), { encoding: 'utf8' });
  return Promise.resolve();
}

export async function deserialize(context: types.IExtensionContext): Promise<LoadOrder> {
  const props: IProps = genProps(context);
  if (props?.profile?.gameId !== GAME_ID) {
    // Why are we deserializing when the profile is invalid or belongs to
    //  another game ?
    return [];
  }

  const currentModsState = util.getSafe(props.profile, ['modState'], {});
  const enabledModIds = Object.keys(currentModsState).filter(modId => util.getSafe(currentModsState, [modId, 'enabled'], false));
  const mods: { [modId: string]: types.IMod } = util.getSafe(props.state, ['persistent', 'mods', GAME_ID], {});
  const loFilePath = await ensureLOFile(context);
  const fileData = await fs.readFileAsync(loFilePath, { encoding: 'utf8' });
  try {
    const data: ILoadOrderEntry[] = JSON.parse(fileData);
    if (enabledModIds.length === data.length) {
      // This game has a 1 mod per 1 pak mapping, so if the number of enabled mods matches
      //  the number of entries we found in the loFile - we're good.
      return data;
    }

    // User may have disabled/removed a mod - we need to filter out any existing
    //  entries from the data we parsed.
    const filteredData = data.filter(entry => enabledModIds.includes(entry.id));

    // Check if the user added any new mods.
    const diff = enabledModIds.filter(id => filteredData.find(loEntry => loEntry.id === id) === undefined);
    diff.forEach(missingEntry => {
      filteredData.push({
      id: missingEntry,
      enabled: true,
      name: mods[missingEntry] !== undefined
        ? util.renderModName(mods[missingEntry])
        : missingEntry,
      modId: missingEntry,
      })
    });
    return filteredData;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function validate(prev: LoadOrder,
                               current: LoadOrder): Promise<any> {
  // Nothing to validate really - the game does not read our load order file
  //  and we don't want to apply any restrictions either, so we just
  //  return.
  return undefined;
}
