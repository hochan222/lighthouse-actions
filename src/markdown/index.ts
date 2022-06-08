import { readFile } from 'fs/promises';
import { PERSISTENT_DATA_PATH, REPORT_PATH } from '../libs/constants';
import { guaranteeFolderPath, write } from '../libs/file';
import { generateAuditsMarkdown } from './lhr/audits';
import { generateCategoryMarkdown } from './lhr/categories';
import { BREAK_LINE, h1 } from './markdown';

function sortLastestDate(data) {
  return Object.keys(data).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
}

export async function generateMarkdown({ path }) {
  const data = JSON.parse(await readFile(`${PERSISTENT_DATA_PATH}/${path}.json`, 'utf8'));
  data.sortedDate = sortLastestDate(data);

  const latestData = data[data.sortedDate[0]];
  const { categories, audits } = latestData;

  const content = [
    h1('Web Performance Report'),
    BREAK_LINE,
    ...(await generateCategoryMarkdown(path, categories)),
    BREAK_LINE,
    ...(await generateAuditsMarkdown(path, audits)),
    BREAK_LINE,
  ].join('\n');

  guaranteeFolderPath(`./${REPORT_PATH}/${path}`);
  write({ path: `${REPORT_PATH}/${path}/report.md`, content, type: 'string' });
}
