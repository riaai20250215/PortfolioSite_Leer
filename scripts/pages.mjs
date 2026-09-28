/* どのページに、どのセクションの静的HTMLを埋めるか。
   build-content.mjs (生成) と verify-site.mjs (照合) が同じ表を見る。
   works-all (全作品の一覧) は作品一覧ページだけが持つ。 */
import { SECTIONS } from '../public/content-render.js';

export const PAGES = [
  { file: 'public/index.html', keys: SECTIONS.map(section => section.key).filter(key => key !== 'works-all') },
  { file: 'public/works/index.html', keys: ['works-all'] }
];
