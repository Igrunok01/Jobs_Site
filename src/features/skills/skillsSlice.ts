import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

type SkillsState = { list: string[]; value: string };
const defaultSkills: string[] = ['TypeScript', 'React', 'Redux'];
const initialState: SkillsState = { list: defaultSkills, value: '' };
const norm = (s: string) => s.trim().toLowerCase();

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    setInput(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
    addSkill(state) {
      const v = state.value.trim();
      if (!v) return;
      if (!state.list.some((i) => norm(i) === norm(v))) {
        state.list.push(v);
        state.value = '';
      }
    },
    removeSkill(state, action: PayloadAction<string>) {
      state.list = state.list.filter((i) => norm(i) !== norm(action.payload));
    },
  },
});

export const { addSkill, setInput, removeSkill } = skillsSlice.actions;
export default skillsSlice.reducer;
export const selectSkills = (s: RootState) => s.skills.list;
export const selectInputSkills = (s: RootState) => s.skills.value;
