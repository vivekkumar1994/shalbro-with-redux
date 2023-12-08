

// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { useSelector } from 'react-redux';



// export const getAllCompanies = createAsyncThunk(
//   'company/getAllCompanies',
//   async (payload, { rejectWithValue }) => {
//     try {
//       // Use useSelector to get adminId and adminUsername from the Redux store
//       console.log('Before useSelector');
//       const { user } = useSelector((state) => state.admin);
//       const {company} = useSelector((state)=> state.user)
//       console.log(user);

//       console.log('After useSelector:', user);

  

//       // Add adminId and adminUsername to the payload
//       const updatedPayload = {
//         ...payload,
 
//       };

//       const response = await axios.put('/api/get_all_company', updatedPayload);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );


// // export const getAllCompanies = createAsyncThunk(
// //   "company/getAllCompanies",
// //   async (payload, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.post("/api/get_all_company", payload);
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(error.response.data);
// //     }
// //   }
// // );

// const companySlice = createSlice({
//   name: 'company',
//   initialState: {
//     companies: [],
//   },
//   reducers: {
//     companyAdded: (state, action) => {
//       state.companies.push(action.payload);
//     },
//     // Add other reducers as needed
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(getAllCompanies.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(getAllCompanies.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.companies = action.payload;
//       })
//       .addCase(getAllCompanies.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       });
//   },

// });

// export const { companyAdded} = companySlice.actions;

// export default companySlice.reducer;


import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk for fetching all companies
export const getAllCompanies = createAsyncThunk(
  'company/getAllCompanies',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const { user } = getState().admin;

      const updatedPayload = {
        ...payload,
        ADMIN_ID: user.ADMIN_ID,
        ADMIN_USERNAME: user.ADMIN_USERNAME,
      };

      const response = await axios.put('/api/get_all_company', updatedPayload);
      return response.data.result; // Assuming the data is inside the "result" field
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const getAllCompaniesData= createSlice({
  name: 'company',
  initialState: {
    companies: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setRowsCompany: (state, action) => {
      state.data = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    setErrorCompany: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    setLoadingCompany: (state, action) => {
      state.status = 'loading';
      state.error = null;
    },
    // Add other reducers as needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCompanies.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAllCompanies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.companies = action.payload;
      })
      .addCase(getAllCompanies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setErrorCompany,setLoadingCompany,setRowsCompany } = getAllCompaniesData.actions;

export default getAllCompaniesData.reducer;
