import * as avanumAvalum from './poems/avanum-avalum';
import * as akalaVilakku from './poems/akala-vilakku';
import * as adadeAnbuMazhai from './poems/adade-anbu-mazhai';
import * as anbuSeiAnthi from './poems/anbu-sei-anthi';
import * as paniyidaiPaninadai from './poems/paniyidai-paninadai';
import * as neelaNeelaParavai from './poems/neela-neela-paravai';

export type Poem = {
  slug: string;
  title: string;
  poem: string;
  date: string;
};

export type Poems = Array<Poem>;

export const poems: Poems = [
  avanumAvalum,
  akalaVilakku,
  adadeAnbuMazhai,
  anbuSeiAnthi,
  paniyidaiPaninadai,
  neelaNeelaParavai,
];
