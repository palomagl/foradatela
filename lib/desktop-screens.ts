import type { Project } from './projects';

type Screen = {
  src: string;
  width: number;
  height: number;
  crop: readonly [number, number, number, number];
  background: string;
  statusBackground: string;
  statusInk: string;
  bottomRadius: number;
  bottomColor: string;
  maskPath?: string;
};

// Legacy screenshots include a phone frame and OS chrome. These rectangles
// describe only the app, in original image pixels; the source files stay intact.
const legacy: Record<string, {
  sizes: readonly [number, number][];
  crops: readonly (readonly [number, number, number, number])[];
  background: string;
  statusBackground: string;
  statusInk: string;
}> = {
  stopou: { sizes: [[344, 722], [380, 726]], crops: [[0, 23, 338, 699], [0, 43, 329, 683]], background: '#18265e', statusBackground: '#1d3498', statusInk: '#fff' },
  ritimo: { sizes: [[358, 713], [366, 714]], crops: [[0, 14, 330, 699], [4, 22, 347, 692]], background: '#edf3ff', statusBackground: '#edf3ff', statusInk: '#17243b' },
  rotina: { sizes: [[380, 700], [370, 730]], crops: [[0, 21, 344, 679], [0, 44, 344, 686]], background: '#f6f7f9', statusBackground: '#f6f7f9', statusInk: '#17243b' },
  karoane: { sizes: [[390, 844], [343, 723]], crops: [[0, 0, 390, 844], [0, 44, 341, 679]], background: '#fff', statusBackground: '#1b4670', statusInk: '#fff' },
  financas: { sizes: [[412, 788], [397, 787]], crops: [[29, 56, 347, 697], [25, 56, 347, 697]], background: '#e3f1eb', statusBackground: '#245d47', statusInk: '#fff' },
  doe: { sizes: [[361, 735], [348, 720]], crops: [[5, 31, 345, 696], [0, 37, 333, 683]], background: '#f7f7f7', statusBackground: '#ed1518', statusInk: '#fff' },
  bruto: { sizes: [[324, 713], [346, 723]], crops: [[0, 26, 322, 687], [0, 30, 327, 671]], background: '#101010', statusBackground: '#101010', statusInk: '#fff' },
  roxo: { sizes: [[1170, 2532], [1170, 2532]], crops: [[0, 0, 1170, 2532], [0, 0, 1170, 2532]], background: '#faf7f4', statusBackground: '#faf7f4', statusInk: '#4a2057' },
  vertice: { sizes: [[1170, 2532], [1170, 2532]], crops: [[0, 0, 1170, 2532], [0, 0, 1170, 2532]], background: '#f3f4f6', statusBackground: '#0f1c30', statusInk: '#fff' },
};

export function desktopScreens(project: Project): Screen[] {
  const preset = legacy[project.id];
  if (!preset) return [];
  return project.screenshots.slice(0, 2).map<Screen>((src, index) => ({
    src: src.replace(/\.webp$/, '.png'),
    width: preset.sizes[index][0],
    height: preset.sizes[index][1],
    crop: preset.crops[index],
    background: preset.background,
    statusBackground: preset.statusBackground,
    statusInk: preset.statusInk,
    bottomRadius: project.id === 'financas' ? 28 : 0,
    bottomColor: project.id === 'financas' && index === 1 ? '#a4d8c4' : preset.background,
    // Follow the old glass edge precisely, retaining the text in the center.
    maskPath: project.id === 'financas' ? [
      'M30 56H375V725L374 725L374 731L373 737L371 743L369 747L366 751L364 753H41L39 751L36 747L34 743L32 737L31 731L30 725Z',
      'M26 56H371V725L371 725L370 731L369 737L367 743L365 747L362 751L360 753H36L35 751L32 747L30 743L28 737L26 731L26 725Z',
    ][index] : undefined,
  }));
}
