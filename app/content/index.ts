import * as avanumAvalum from './poems/avanum-avalum';
import * as akalaVilakku from './poems/akala-vilakku';
import * as adadeAnbuMazhai from './poems/adade-anbu-mazhai';
import * as anbuSeiAnthi from './poems/anbu-sei-anthi';
import * as paniyidaiPaninadai from './poems/paniyidai-paninadai';
import * as neelaNeelaParavai from './poems/neela-neela-paravai';
import * as avalSoozhUlagu from './poems/aval-soozh-ulagu';
import * as surumpoo from './poems/surumpoo';
import * as anbuchoodi from './poems/anbuchoodi';
import * as mukavolai from './poems/mukavolai';
import * as uzhaththipaattu from './poems/uzhaththipaattu';
import * as irangarpa from './poems/irangarpa';
import * as vizhuppun from './poems/vizhuppun';
import * as narumeen from './poems/narumeen';
import * as neeraviSeelai from './poems/neeravi-seelai';
import * as haikus from './poems/haikus';
import * as avalOruVidukathai from './poems/aval-oru-vidukathai';
import * as maayam from './poems/maayam';
import * as kolaikaari from './poems/kolaikaari';

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
  avalSoozhUlagu,
  surumpoo,
  anbuchoodi,
  mukavolai,
  uzhaththipaattu,
  irangarpa,
  vizhuppun,
  narumeen,
  neeraviSeelai,
  haikus,
  avalOruVidukathai,
  maayam,
  kolaikaari,
];
