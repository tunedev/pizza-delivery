/**
 * the entry of the app
 */

import server from './lib/server.mjs';
import { create, read, update, del, list } from './lib/data/data.mjs';

const testCreate = async () => {
  const { error, data } = await create('user', 'mail2', { sup: 'self' });
  if (error) {
    console.log('From test create ni ooh', error);
  } else {
    console.log(data);
  }
};

const testRead = async () => {
  const { error, data } = await read('user', 'mail');
  if (error) {
    console.log('From test read ni oh', error);
  } else {
    console.log('Data rey ooh ->', data);
  }
};

const testUpdate = async () => {
  const { error, data } = await update('user', 'mail', { sup: 'i dey boss' });
  if (error) {
    console.log('From test update ni oh', error);
  } else {
    console.log('update rey ooh ->', data);
  }
};

const testList = async () => {
  const { error, data } = await list('user');
  if (error) {
    console.log('From test list ni oh', error);
  } else {
    console.log('list rey ooh ->', data);
  }
};

const testDel = async () => {
  const { error, data } = await del('user', 'mail2');
  if (error) {
    console.log('From test del ni oh', error);
  } else {
    console.log('del rey ooh ->', data);
  }
};

Promise.all([testCreate(), testRead(), testUpdate(), testList(), testDel()]);

server.init();
