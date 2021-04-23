import { createWriteStream } from "fs";
import * as Axios from "axios";
import { v4 as uuidV4 } from "uuid";

const axios = Axios.default;

export async function downloadFile(url: string, ext: string) {
    const path = `documents/${uuidV4()}-${uuidV4()}.${ext}`;
    const writer = createWriteStream(path);

    const response = await axios.get(url);
    console.log()
    // response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
}