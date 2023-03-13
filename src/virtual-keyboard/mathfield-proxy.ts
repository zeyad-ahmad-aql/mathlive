import { MathfieldPrivate } from 'editor-mathfield/mathfield-private';
import { MathfieldProxy } from './types';

export function makeProxy(mf: MathfieldPrivate): MathfieldProxy {
  return {
    value: mf.model.getValue(),
    selectionIsCollapsed: mf.model.selectionIsCollapsed,
    canUndo: mf.canUndo(),
    canRedo: mf.canRedo(),
  };
}
