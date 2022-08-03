import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { toast } from 'react-toastify';
import moduleService from './moduleService'
import {checkPreclusions, prereqTreeToArray, satisfyPrereqWithPreclusions, checkPreclusionInPlanner, prereqArrayToString, satisfiesProgramme, eligibleForGraduation} from './moduleHelper'

const canGraduate = JSON.parse(localStorage.getItem('eligible'))
const user = JSON.parse(localStorage.getItem('user'))

// JSON.parse(localStorage.getItem('planner'))

const initialState = {
  modules: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isWarning: false,
  canGraduate: canGraduate ? canGraduate : false,
  message: '',
  requirements: [],
  selectedRequirementIndex: user ? user.major === "No Major Specified" ? 0 : parseInt(user.major, 10) : 0,
}

// Get posts
export const getModules = createAsyncThunk(
  'planner/getModules',
  async (_, thunkAPI) => {
    try {
      return await moduleService.getModules()
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get requirements
export const getReq = createAsyncThunk('planner/getReq', async (_, thunkAPI) => {
  try {
      return await moduleService.getReq()
  } catch(error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
  }
})

// Add module
export const addModule = createAsyncThunk('planner/addModule', async (addModuleData, thunkAPI, getState) => {
  try {
    let semesters = JSON.parse(JSON.stringify(thunkAPI.getState().auth.user.planner));
    let modules = JSON.parse(JSON.stringify(thunkAPI.getState().modules.modules))
    let moduleObject = addModuleData.module
    let semesterId = addModuleData.semesterId
    let modulesTakenPreviously = []
    let previousSemesters = semesters.filter((semester, idx) => idx < semesterId)
    let currentSemester = semesters.filter((semester, idx) => idx === semesterId)

    let modulesTaken = []
    semesters.forEach(semester => {
      modulesTaken = modulesTaken.concat(semester.modules)
    })
    

    // Check if module already taken
    for (let currentModule of modulesTaken) {
      if (currentModule.moduleCode === moduleObject.moduleCode) {
        //state.isError = true;
        throw new Error(`${moduleObject.moduleCode} already exists in the planner`);
      }
    }

    // Generate array of modules taken in previous semesters
    for (let previousSemester of previousSemesters) {
      modulesTakenPreviously = modulesTakenPreviously.concat(previousSemester.modules)
    }

    let relevantModules = modulesTakenPreviously.concat(currentSemester[0].modules).map(module => module.moduleCode)
    

    // Check if module's preclusions are in previous semesters
    const preclusionInPlanner = checkPreclusionInPlanner(moduleObject.moduleCode, relevantModules, [], modules)
    if (preclusionInPlanner) {
      // state.isWarning = true;
      toast.warning(`${moduleObject.moduleCode} may already exist in the planner as a preclusion, 
                        please double check against NUSMods if unsure`)
    }
    

    // Check if module already taken in previous semesters
    for (let previousModule of modulesTakenPreviously) {
      if (moduleObject.moduleCode === previousModule.moduleCode) {
        //state.isError = true;
        throw new Error(`${moduleObject.moduleCode} already exists in the planner`)
      }
    }

    // Check if pre-requisites for module are satisfied

    let prereqArray = prereqTreeToArray(moduleObject.prereqTree, moduleObject.moduleCode);
    for (let previousModule of modulesTakenPreviously) {
      prereqArray = satisfyPrereqWithPreclusions(previousModule, prereqArray);
    }

    if (prereqArray.length !== 0) {
      //state.isError = true;
      throw new Error(`You have not satisfied the following pre-requisites for ${moduleObject.moduleCode}: ${prereqArrayToString(prereqArray)}`)
    }

    

    // Add module to semester
    for (let i = 0; i < semesters.length; i++) {
      if (i === semesterId) {
        semesters[i].modules.push(moduleObject)
      }
    }
    // localStorage.setItem('planner', JSON.stringify(semesters))
    return semesters
  } catch(error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
  }
})

// Delete module
export const deleteModule = createAsyncThunk('planner/deleteModule', async (deleteModuleData, thunkAPI) => {
  try {
    let semesters = JSON.parse(JSON.stringify(thunkAPI.getState().auth.user.planner));
    let moduleObject = deleteModuleData.module
    let semesterId = deleteModuleData.semesterId
    let precedingModules = []
    let precedingSemesters = semesters.filter((semester, idx) => idx > semesterId)

    // generate array of modules taken in preceding semesters
    for (let precedingSemester of precedingSemesters) {
      precedingModules = precedingModules.concat(precedingSemester.modules)
    }

    // generate array of modules taken 
    let isPreclusion = false;
    let errMessage = ""
    console.log("working")
    for (let precedingModule of precedingModules) {
      console.log("checking" + moduleObject.moduleCode)
      if (checkPreclusions(precedingModule.prereqTree, moduleObject)) {
        isPreclusion = true;
        errMessage = errMessage === ''
                        ? `Note that the following modules may 
                          require ${moduleObject.moduleCode} as a 
                          pre-requisite: ${precedingModule.moduleCode}`
                        : errMessage + `, ${precedingModule.moduleCode}`
      }
    }

    if (isPreclusion) {
      toast.warning(errMessage);
    }

    for (let i = 0; i < semesters.length; i++) {
      if (i === semesterId) {
        semesters[i].modules = semesters[i].modules.filter(module => module.moduleCode !== moduleObject.moduleCode)
      }
    }
    // localStorage.setItem('planner', JSON.stringify(semesters))
    return semesters;
  } catch(error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
  }
})

// shift module from one semester to another
export const shiftModule = createAsyncThunk('planner/shiftModule', async (shiftModuleData, thunkAPI) => {
  try {
    // delete module
    let semesters = JSON.parse(JSON.stringify(thunkAPI.getState().auth.user.planner));
    let modules = JSON.parse(JSON.stringify(thunkAPI.getState().modules.modules))
    let moduleObject = shiftModuleData.module
    let previousSemesterId = shiftModuleData.previousSemesterId
    let precedingModules = []
    let precedingSemesters = semesters.filter((semester, idx) => idx > previousSemesterId)
    let currentSemesterId = shiftModuleData.currentSemesterId
    let modulesTakenPreviously = []
    let previousSemesters = semesters.filter((semester, idx) => idx < currentSemesterId)
    let currentSemester = semesters.filter((semester, idx) => idx === currentSemesterId)

    // generate array of modules taken in preceding semesters
    // generate array of modules taken 
    let isPreclusion = false;
    let errMessage = ""
    let index = previousSemesterId + 1;
    let lowest = Number.MAX_VALUE;
    for (let precedingSemester of precedingSemesters) {
      precedingModules = precedingModules.concat(precedingSemester.modules)
      for (let precedingModule of precedingSemester.modules) {
        if (checkPreclusions(precedingModule.prereqTree, moduleObject)) {
          lowest = index < lowest ? index : lowest;
          isPreclusion = true;
          errMessage = errMessage === ''
                          ? `Note that the following modules may 
                            require ${moduleObject.moduleCode} as a 
                            pre-requisite: ${precedingModule.moduleCode}`
                          : errMessage + `, ${precedingModule.moduleCode}`
        }
      }
      index++;
    }

    if (isPreclusion  && currentSemesterId >= lowest) {
      toast.warning(errMessage);
    }

    for (let i = 0; i < semesters.length; i++) {
      if (i === previousSemesterId) {
        semesters[i].modules = semesters[i].modules.filter(module => module.moduleCode !== moduleObject.moduleCode)
      }
    }
    // add module 

    let modulesTaken = []
    semesters.forEach(semester => {
      modulesTaken = modulesTaken.concat(semester.modules)
    })

    // Generate array of modules taken in previous semesters
    for (let previousSemester of previousSemesters) {
      modulesTakenPreviously = modulesTakenPreviously.concat(previousSemester.modules)
    }

    let relevantModules = modulesTakenPreviously.concat(currentSemester[0].modules).map(module => module.moduleCode)
  

    // Check if module's preclusions are in previous semesters
    const preclusionInPlanner = checkPreclusionInPlanner(moduleObject.moduleCode, relevantModules, [], modules)
    if (preclusionInPlanner) {
      // state.isWarning = true;
      toast.warning(`${moduleObject.moduleCode} may already exist in the planner as a preclusion after this change, 
                        please double check against NUSMods if unsure`)
    }

    // Check if pre-requisites for module are satisfied
    let prereqArray = prereqTreeToArray(moduleObject.prereqTree, moduleObject.moduleCode);
    for (let previousModule of modulesTakenPreviously) {
      prereqArray = satisfyPrereqWithPreclusions(previousModule, prereqArray);
    }

    if (prereqArray.length !== 0) {
      throw new Error(`This change will cause you to not fulfil the following pre-requisites for ${moduleObject.moduleCode}: ${prereqArrayToString(prereqArray)}`)
    }

    

    // Add module to semester
    for (let i = 0; i < semesters.length; i++) {
      if (i === currentSemesterId) {
        semesters[i].modules.push(moduleObject)
      }
    }

    
    // localStorage.setItem('planner', JSON.stringify(semesters))
    return semesters;
  } catch(error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
  }
})

// Check graduation fulfillment
export const checkGraduation = createAsyncThunk('planner/checkGraduation', async (_, thunkAPI) => {
  try {
    let semesters = JSON.parse(JSON.stringify(thunkAPI.getState().auth.user.planner))
    let requirements = JSON.parse(JSON.stringify(thunkAPI.getState().modules.requirements));
    let chosenRequirementIndex = thunkAPI.getState().modules.selectedRequirementIndex;
    let modulesTaken = []
    semesters.forEach(semester => {
      modulesTaken = modulesTaken.concat(semester.modules)
    })

    // console.log(JSON.stringify(modulesTaken.map(module => module.moduleCode)))
    // const copyRequirements = state.requirements.length > 0 ? JSON.parse(JSON.stringify(state.requirements[2].requirements)) : [];
    const copyRequirements = requirements[chosenRequirementIndex].requirements;

    const eligible = eligibleForGraduation(satisfiesProgramme(copyRequirements, modulesTaken))
    localStorage.setItem('eligible', eligible)
    return eligible;
  } catch(error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
  }
})

// Save semester title after editing
export const saveSemester = createAsyncThunk('planner/saveSemester', async (saveData, thunkAPI) => {
  try {
      const content = saveData.content
      const semesterId = saveData.semesterId
      let semesters = JSON.parse(JSON.stringify(thunkAPI.getState().auth.user.planner))
      let result = semesters.map((semester, idx) => {
        if (idx === semesterId) {
          const editedSemester = {
            ...semester,
            title: content
          }
          return editedSemester
        } else {
          return semester;
        }
      })
      // localStorage.setItem('planner', JSON.stringify(result))
      return result;
  } catch(error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
  }
})

// Remove all modules from the semesters
export const clearSemesters = createAsyncThunk('planner/clearSemesters', async (_, thunkAPI) => {
  try {
      let semesters = JSON.parse(JSON.stringify(thunkAPI.getState().auth.user.planner))
      semesters.forEach(semester => semester.modules = [])
      // localStorage.setItem('planner', JSON.stringify(semesters))
      return semesters;
  } catch(error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
  }
})

// Add semester
export const addSemester = createAsyncThunk('planner/addSemester', async (semester, thunkAPI) => {
  try {
      let semesters = JSON.parse(JSON.stringify(thunkAPI.getState().auth.user.planner))
      semesters.push(semester)
      // localStorage.setItem('planner', JSON.stringify(semesters))
      return semesters;
  } catch(error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
  }
})

// Delete semester
export const deleteSemester = createAsyncThunk('planner/deleteSemester', async (semesterId, thunkAPI) => {
  try {
      let semesters = JSON.parse(JSON.stringify(thunkAPI.getState().auth.user.planner))
      let result = semesters.filter((semester, index) => index !== semesterId)
      let currentSemester = semesters[semesterId];
      for (let module of currentSemester.modules) {
        console.log(module.moduleCode);
        const deleteModuleData = {
          semesterId: semesterId,
          module: module,
        }
        thunkAPI.dispatch(deleteModule(deleteModuleData));
      }
      
      // localStorage.setItem('planner', JSON.stringify(result))
      return result;
  } catch(error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
  }
})

// Set requirement to view
export const setSelectedIndex = createAsyncThunk('planner/setSelectedIndex', async (index, thunkAPI) => {
  try {
      return parseInt(index, 10);
  } catch(error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
  }
})

export const moduleSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
      state.isWarning = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getModules.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getModules.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.modules = action.payload
      })
      .addCase(getModules.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload 
      })
      .addCase(getReq.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getReq.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.requirements = action.payload
      })
      .addCase(getReq.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload 
      })
      .addCase(addModule.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addModule.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.semesters = action.payload
      })
      .addCase(addModule.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload 
      })
      .addCase(deleteModule.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteModule.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.semesters = action.payload
      })
      .addCase(deleteModule.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload 
      })
      .addCase(shiftModule.pending, (state) => {
        state.isLoading = true
      })
      .addCase(shiftModule.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.semesters = action.payload
      })
      .addCase(shiftModule.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload 
      })
      .addCase(checkGraduation.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkGraduation.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.canGraduate = action.payload
      })
      .addCase(checkGraduation.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload 
      })
      .addCase(saveSemester.pending, (state) => {
        state.isLoading = true
      })
      .addCase(saveSemester.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.semesters = action.payload
      })
      .addCase(saveSemester.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload 
      })
      .addCase(clearSemesters.pending, (state) => {
        state.isLoading = true
      })
      .addCase(clearSemesters.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.semesters = action.payload
      })
      .addCase(clearSemesters.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload 
      })
      .addCase(addSemester.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addSemester.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.semesters = action.payload
      })
      .addCase(addSemester.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload 
      })
      .addCase(deleteSemester.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteSemester.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.semesters = action.payload
      })
      .addCase(deleteSemester.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload 
      })
      .addCase(setSelectedIndex.pending, (state) => {
        state.isLoading = true
      })
      .addCase(setSelectedIndex.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.selectedRequirementIndex = action.payload
      })
      .addCase(setSelectedIndex.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload 
      })
  },
})

export const { reset } = moduleSlice.actions
export default moduleSlice.reducer