import { CrystalCompressor } from "crystal-compressor";
import { DBO } from "divine-binary-object";

export const CJSON = {
  async defalte(data: any): Promise<ArrayBuffer> {
    return (
      await CrystalCompressor.compressArray(
        new Uint8Array(DBO.objectToBuffer(data))
      )
    ).buffer;
  },
  async inflate<T = any>(buffer: ArrayBuffer): Promise<T> {
    return DBO.bufferToObject(
      await (
        await CrystalCompressor.decompressArray(buffer, "Uint8")
      ).buffer
    );
  },
};
