import { source } from '@/lib/source';
import { docs } from '@/.source';

export const ui = source.createSource({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
