import { readdir, mkdir, open, writeFile, readFile, unlink } from 'fs/promises';
import { parseJSONToObj } from '../helpers.mjs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const baseDir = path.join(__dirname, '../../.data');

export const create = async (dir, filename, data) => {
  let fileHandle;
  try {
    const directories = await readdir(baseDir);
    if (!directories.includes(dir)) {
      await mkdir('.data/' + dir);
    }

    fileHandle = await open(`${baseDir}/${dir}/${filename}.json`, 'wx');
    const stringedData = JSON.stringify(data);

    await writeFile(fileHandle, stringedData);
    return { data: 'File created successfully' };
  } catch (error) {
    console.log('error occured while creating data', error);
    return { error: error.message };
  } finally {
    fileHandle?.close();
  }
};

export const read = async (dir, filename) => {
  try {
    console.log(`${baseDir}/${dir}/${filename}.json`);
    const fileContent = await readFile(
      `${baseDir}/${dir}/${filename}.json`,
      'utf8'
    );
    const data = parseJSONToObj(fileContent);
    return { data };
  } catch (error) {
    console.log('Error occured while reading file =>', error);
    return { error: error.message };
  }
};

export const update = async (dir, file, data) => {
  let fileHandle;
  try {
    const { error, data: fileContent } = await read(dir, file);
    if (error) throw new Error(error);

    fileHandle = await open(`${baseDir}/${dir}/${file}.json`, 'r+');
    const stringedData = JSON.stringify({ ...data, ...fileContent });
    await fileHandle.truncate();
    await writeFile(fileHandle, stringedData);
    return { data: 'File updated successfully' };
  } catch (error) {
    console.log('Error while attempting file update =>', error);
    return { error: error.message };
  } finally {
    fileHandle?.close();
  }
};

export const del = async (dir, filename) => {
  try {
    await unlink(`${baseDir}/${dir}/${filename}.json`);
    return { data: `${filename}.json has being deleted successfully` };
  } catch (error) {
    console.log('Error occurred while attempting to delete file', error);
    return { error: error.message };
  }
};

export const list = async (dir, withExtention = false) => {
  try {
    const files = await readdir(`${baseDir}/${dir}`);
    const data = withExtention
      ? files
      : files.map((fileName) => fileName?.replace('.json', ''));
    return { data };
  } catch (error) {
    console.log(`Error while ttrying to list out the files in: ${dir}`, error);
    return { error: error.message };
  }
};
