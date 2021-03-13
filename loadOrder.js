"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.deserialize = exports.serialize = void 0;
const vortex_api_1 = require("vortex-api");
const common_1 = require("./common");
const util_1 = require("./util");
function serialize(context, loadOrder) {
    return __awaiter(this, void 0, void 0, function* () {
        const props = util_1.genProps(context);
        if (props === undefined) {
            return Promise.reject(new vortex_api_1.util.ProcessCanceled('invalid props'));
        }
        const loFilePath = yield util_1.ensureLOFile(context);
        const prefixedLO = loadOrder.map((loEntry, idx) => {
            const prefix = util_1.makePrefix(idx);
            const data = {
                prefix,
            };
            return Object.assign(Object.assign({}, loEntry), { data });
        });
        yield vortex_api_1.fs.removeAsync(loFilePath).catch({ code: 'ENOENT' }, () => Promise.resolve());
        yield vortex_api_1.fs.writeFileAsync(loFilePath, JSON.stringify(prefixedLO), { encoding: 'utf8' });
        return Promise.resolve();
    });
}
exports.serialize = serialize;
function deserialize(context) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const props = util_1.genProps(context);
        if (((_a = props === null || props === void 0 ? void 0 : props.profile) === null || _a === void 0 ? void 0 : _a.gameId) !== common_1.GAME_ID) {
            return [];
        }
        const currentModsState = vortex_api_1.util.getSafe(props.profile, ['modState'], {});
        const enabledModIds = Object.keys(currentModsState).filter(modId => vortex_api_1.util.getSafe(currentModsState, [modId, 'enabled'], false));
        const mods = vortex_api_1.util.getSafe(props.state, ['persistent', 'mods', common_1.GAME_ID], {});
        const loFilePath = yield util_1.ensureLOFile(context);
        const fileData = yield vortex_api_1.fs.readFileAsync(loFilePath, { encoding: 'utf8' });
        try {
            const data = JSON.parse(fileData);
            if (enabledModIds.length === data.length) {
                return data;
            }
            const filteredData = data.filter(entry => enabledModIds.includes(entry.id));
            const diff = enabledModIds.filter(id => filteredData.find(loEntry => loEntry.id === id) === undefined);
            diff.forEach(missingEntry => {
                filteredData.push({
                    id: missingEntry,
                    enabled: true,
                    name: mods[missingEntry] !== undefined
                        ? vortex_api_1.util.renderModName(mods[missingEntry])
                        : missingEntry,
                    modId: missingEntry,
                });
            });
            return filteredData;
        }
        catch (err) {
            return Promise.reject(err);
        }
    });
}
exports.deserialize = deserialize;
function validate(prev, current) {
    return __awaiter(this, void 0, void 0, function* () {
        return undefined;
    });
}
exports.validate = validate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZE9yZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hZE9yZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QztBQUU3QyxxQ0FBbUM7QUFFbkMsaUNBQTREO0FBRTVELFNBQXNCLFNBQVMsQ0FBQyxPQUFnQyxFQUNoQyxTQUFvQjs7UUFDbEQsTUFBTSxLQUFLLEdBQVcsZUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUN2QixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxpQkFBSSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1NBQ2xFO1FBRUQsTUFBTSxVQUFVLEdBQUcsTUFBTSxtQkFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9DLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUF3QixFQUFFLEdBQVcsRUFBRSxFQUFFO1lBQ3pFLE1BQU0sTUFBTSxHQUFHLGlCQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0IsTUFBTSxJQUFJLEdBQXNCO2dCQUM5QixNQUFNO2FBQ1AsQ0FBQztZQUNGLHVDQUFZLE9BQU8sS0FBRSxJQUFJLElBQUc7UUFDOUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLGVBQUUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3BGLE1BQU0sZUFBRSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ3RGLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzNCLENBQUM7Q0FBQTtBQW5CRCw4QkFtQkM7QUFFRCxTQUFzQixXQUFXLENBQUMsT0FBZ0M7OztRQUNoRSxNQUFNLEtBQUssR0FBVyxlQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEMsSUFBSSxPQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxPQUFPLDBDQUFFLE1BQU0sTUFBSyxnQkFBTyxFQUFFO1lBR3RDLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFFRCxNQUFNLGdCQUFnQixHQUFHLGlCQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2RSxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsaUJBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMvSCxNQUFNLElBQUksR0FBb0MsaUJBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLFlBQVksRUFBRSxNQUFNLEVBQUUsZ0JBQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sVUFBVSxHQUFHLE1BQU0sbUJBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQyxNQUFNLFFBQVEsR0FBRyxNQUFNLGVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDMUUsSUFBSTtZQUNGLE1BQU0sSUFBSSxHQUFzQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JELElBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUd4QyxPQUFPLElBQUksQ0FBQzthQUNiO1lBSUQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFHNUUsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQzFCLFlBQVksQ0FBQyxJQUFJLENBQUM7b0JBQ2xCLEVBQUUsRUFBRSxZQUFZO29CQUNoQixPQUFPLEVBQUUsSUFBSTtvQkFDYixJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLFNBQVM7d0JBQ3BDLENBQUMsQ0FBQyxpQkFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBQ3hDLENBQUMsQ0FBQyxZQUFZO29CQUNoQixLQUFLLEVBQUUsWUFBWTtpQkFDbEIsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLFlBQVksQ0FBQztTQUNyQjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzVCOztDQUNGO0FBekNELGtDQXlDQztBQUVELFNBQXNCLFFBQVEsQ0FBQyxJQUFlLEVBQ2YsT0FBa0I7O1FBSS9DLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7Q0FBQTtBQU5ELDRCQU1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZnMsIHR5cGVzLCB1dGlsIH0gZnJvbSAndm9ydGV4LWFwaSc7XHJcblxyXG5pbXBvcnQgeyBHQU1FX0lEIH0gZnJvbSAnLi9jb21tb24nO1xyXG5pbXBvcnQgeyBJTG9hZE9yZGVyRW50cnksIElQcm9wcywgSVNlcmlhbGl6YWJsZURhdGEsIExvYWRPcmRlciB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgeyBlbnN1cmVMT0ZpbGUsIGdlblByb3BzLCBtYWtlUHJlZml4IH0gZnJvbSAnLi91dGlsJztcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXJpYWxpemUoY29udGV4dDogdHlwZXMuSUV4dGVuc2lvbkNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZE9yZGVyOiBMb2FkT3JkZXIpOiBQcm9taXNlPHZvaWQ+IHtcclxuICBjb25zdCBwcm9wczogSVByb3BzID0gZ2VuUHJvcHMoY29udGV4dCk7XHJcbiAgaWYgKHByb3BzID09PSB1bmRlZmluZWQpIHtcclxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgdXRpbC5Qcm9jZXNzQ2FuY2VsZWQoJ2ludmFsaWQgcHJvcHMnKSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBsb0ZpbGVQYXRoID0gYXdhaXQgZW5zdXJlTE9GaWxlKGNvbnRleHQpO1xyXG4gIGNvbnN0IHByZWZpeGVkTE8gPSBsb2FkT3JkZXIubWFwKChsb0VudHJ5OiBJTG9hZE9yZGVyRW50cnksIGlkeDogbnVtYmVyKSA9PiB7XHJcbiAgICBjb25zdCBwcmVmaXggPSBtYWtlUHJlZml4KGlkeCk7XHJcbiAgICBjb25zdCBkYXRhOiBJU2VyaWFsaXphYmxlRGF0YSA9IHtcclxuICAgICAgcHJlZml4LFxyXG4gICAgfTtcclxuICAgIHJldHVybiB7IC4uLmxvRW50cnksIGRhdGEgfTtcclxuICB9KTtcclxuXHJcbiAgYXdhaXQgZnMucmVtb3ZlQXN5bmMobG9GaWxlUGF0aCkuY2F0Y2goeyBjb2RlOiAnRU5PRU5UJyB9LCAoKSA9PiBQcm9taXNlLnJlc29sdmUoKSk7XHJcbiAgYXdhaXQgZnMud3JpdGVGaWxlQXN5bmMobG9GaWxlUGF0aCwgSlNPTi5zdHJpbmdpZnkocHJlZml4ZWRMTyksIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcclxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZXNlcmlhbGl6ZShjb250ZXh0OiB0eXBlcy5JRXh0ZW5zaW9uQ29udGV4dCk6IFByb21pc2U8TG9hZE9yZGVyPiB7XHJcbiAgY29uc3QgcHJvcHM6IElQcm9wcyA9IGdlblByb3BzKGNvbnRleHQpO1xyXG4gIGlmIChwcm9wcz8ucHJvZmlsZT8uZ2FtZUlkICE9PSBHQU1FX0lEKSB7XHJcbiAgICAvLyBXaHkgYXJlIHdlIGRlc2VyaWFsaXppbmcgd2hlbiB0aGUgcHJvZmlsZSBpcyBpbnZhbGlkIG9yIGJlbG9uZ3MgdG9cclxuICAgIC8vICBhbm90aGVyIGdhbWUgP1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgY3VycmVudE1vZHNTdGF0ZSA9IHV0aWwuZ2V0U2FmZShwcm9wcy5wcm9maWxlLCBbJ21vZFN0YXRlJ10sIHt9KTtcclxuICBjb25zdCBlbmFibGVkTW9kSWRzID0gT2JqZWN0LmtleXMoY3VycmVudE1vZHNTdGF0ZSkuZmlsdGVyKG1vZElkID0+IHV0aWwuZ2V0U2FmZShjdXJyZW50TW9kc1N0YXRlLCBbbW9kSWQsICdlbmFibGVkJ10sIGZhbHNlKSk7XHJcbiAgY29uc3QgbW9kczogeyBbbW9kSWQ6IHN0cmluZ106IHR5cGVzLklNb2QgfSA9IHV0aWwuZ2V0U2FmZShwcm9wcy5zdGF0ZSwgWydwZXJzaXN0ZW50JywgJ21vZHMnLCBHQU1FX0lEXSwge30pO1xyXG4gIGNvbnN0IGxvRmlsZVBhdGggPSBhd2FpdCBlbnN1cmVMT0ZpbGUoY29udGV4dCk7XHJcbiAgY29uc3QgZmlsZURhdGEgPSBhd2FpdCBmcy5yZWFkRmlsZUFzeW5jKGxvRmlsZVBhdGgsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcclxuICB0cnkge1xyXG4gICAgY29uc3QgZGF0YTogSUxvYWRPcmRlckVudHJ5W10gPSBKU09OLnBhcnNlKGZpbGVEYXRhKTtcclxuICAgIGlmIChlbmFibGVkTW9kSWRzLmxlbmd0aCA9PT0gZGF0YS5sZW5ndGgpIHtcclxuICAgICAgLy8gVGhpcyBnYW1lIGhhcyBhIDEgbW9kIHBlciAxIHBhayBtYXBwaW5nLCBzbyBpZiB0aGUgbnVtYmVyIG9mIGVuYWJsZWQgbW9kcyBtYXRjaGVzXHJcbiAgICAgIC8vICB0aGUgbnVtYmVyIG9mIGVudHJpZXMgd2UgZm91bmQgaW4gdGhlIGxvRmlsZSAtIHdlJ3JlIGdvb2QuXHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFVzZXIgbWF5IGhhdmUgZGlzYWJsZWQvcmVtb3ZlZCBhIG1vZCAtIHdlIG5lZWQgdG8gZmlsdGVyIG91dCBhbnkgZXhpc3RpbmdcclxuICAgIC8vICBlbnRyaWVzIGZyb20gdGhlIGRhdGEgd2UgcGFyc2VkLlxyXG4gICAgY29uc3QgZmlsdGVyZWREYXRhID0gZGF0YS5maWx0ZXIoZW50cnkgPT4gZW5hYmxlZE1vZElkcy5pbmNsdWRlcyhlbnRyeS5pZCkpO1xyXG5cclxuICAgIC8vIENoZWNrIGlmIHRoZSB1c2VyIGFkZGVkIGFueSBuZXcgbW9kcy5cclxuICAgIGNvbnN0IGRpZmYgPSBlbmFibGVkTW9kSWRzLmZpbHRlcihpZCA9PiBmaWx0ZXJlZERhdGEuZmluZChsb0VudHJ5ID0+IGxvRW50cnkuaWQgPT09IGlkKSA9PT0gdW5kZWZpbmVkKTtcclxuICAgIGRpZmYuZm9yRWFjaChtaXNzaW5nRW50cnkgPT4ge1xyXG4gICAgICBmaWx0ZXJlZERhdGEucHVzaCh7XHJcbiAgICAgIGlkOiBtaXNzaW5nRW50cnksXHJcbiAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgIG5hbWU6IG1vZHNbbWlzc2luZ0VudHJ5XSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgPyB1dGlsLnJlbmRlck1vZE5hbWUobW9kc1ttaXNzaW5nRW50cnldKVxyXG4gICAgICAgIDogbWlzc2luZ0VudHJ5LFxyXG4gICAgICBtb2RJZDogbWlzc2luZ0VudHJ5LFxyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZmlsdGVyZWREYXRhO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdmFsaWRhdGUocHJldjogTG9hZE9yZGVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudDogTG9hZE9yZGVyKTogUHJvbWlzZTxhbnk+IHtcclxuICAvLyBOb3RoaW5nIHRvIHZhbGlkYXRlIHJlYWxseSAtIHRoZSBnYW1lIGRvZXMgbm90IHJlYWQgb3VyIGxvYWQgb3JkZXIgZmlsZVxyXG4gIC8vICBhbmQgd2UgZG9uJ3Qgd2FudCB0byBhcHBseSBhbnkgcmVzdHJpY3Rpb25zIGVpdGhlciwgc28gd2UganVzdFxyXG4gIC8vICByZXR1cm4uXHJcbiAgcmV0dXJuIHVuZGVmaW5lZDtcclxufVxyXG4iXX0=