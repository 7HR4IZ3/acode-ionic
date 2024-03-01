import ajax from "@deadlyjack/ajax";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

import Url from "@/utils/Url";
import helpers from "@/utils/helpers";
// import { decode, encode } from 'utils/encodings';

/**
 * Initialize file system
 * @param {string} url
 * @this {object}
 */
function createFs(url) {
  return {
    async lsDir() {
      const entries = await Filesystem.readdir({ path: url });

      return entries.map(entry => ({
        name: entry.name,
        url: entry.uri,
        isFile: entry.type === "file",
        isDirectory: entry.type === "directory"
      }));
    },
    async readFile(encoding) {
      let { data } = await Filesystem.readFile({ path: url, encoding });

      // if (encoding) {
      //   data = await decode(data, encoding);
      // }

      return data;
    },
    async writeFile(content, encoding) {
      // if (typeof content === 'string' && encoding) {
      //   content = await encode(content, encoding);
      // }
      return await Filesystem.writeFile({
        path: url,
        data: content,
        encoding: encoding !== undefined ? encoding : "utf8",
        recursive: false
      });
    },
    createFile(name, data, encoding) {
      return Filesystem.writeFile({
        path: Url.join(url, name),
        data: data || "",
        encoding: encoding !== undefined ? encoding : "utf8",
        recursive: true
      });
    },
    createDirectory(name) {
      return Filesystem.mkdir({
        path: Url.join(url, name),
        recursive: true
      });
    },
    delete() {
      return Filesystem.deleteFile({ path: url });
    },
    copyTo(dest) {
      return Filesystem.copy({ from: url, to: dest });
    },
    async moveTo(dest) {
      let stat = await Filesystem.stat({ path: url });
      await Filesystem.copy({ from: url, to: dest });

      if (stat.type === "file") {
        await Filesystem.delete({ path: url });
      } else {
        await Filesystem.rmdir({ path: url });
      }
    },
    async renameTo(newname) {
      return Filesystem.rename({
        from: url,
        to: Url.join(Url.dirname(url), newname)
      });
    },
    async exists() {
      try {
        await Filesystem.stat({ path: url });
        return true;
      } catch {
        return false;
      }
    },
    stat() {
      return Filesystem.stat({ path: url });
    }
  };
}

export default {
  createFs,
  test: url => /^(file:|content:)/.test(url)
};
