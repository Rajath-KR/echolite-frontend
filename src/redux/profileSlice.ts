import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

type Profile = {
  _id: string;
  fullname: string;
  username: string;
  mobilenumber: string;
  bio: string;
  gender: string;
  dateofbirth: string;
  location: string;
  profileImg?: string;
};

type ProfileState = {
  data: Profile[];
};

const initialState: ProfileState = {
  data: [],
};

export const fetchProfiles = createAsyncThunk<Profile[]>(
  'profiles/fetch',
  async () => {
    const res = await fetch('http://localhost:8000/profile');
    const json = await res.json();
    return json.data;
  },
);

const profileSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchProfiles.fulfilled,
      (state, action: PayloadAction<Profile[]>) => {
        state.data = action.payload;
      },
    );
  },
});

export default profileSlice.reducer;
