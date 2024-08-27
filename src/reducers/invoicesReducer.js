const initialState = {
    data : [],
    serverErrors : []
}

export default function invoicesReducer(state = initialState, action) {
    switch(action.type) {
        case "SET_INVOICES" : {
            return { ...state, data : action.payload }
        }
        case "ADD_INVOICE" : {
            return { ...state, data : [...state.data , action.payload] }
        }
        case "REMOVE_INVOICE" : {
            return { ...state, data : state.data.filter((ele) => {
                return ele._id !== action.payload._id
            })}
        }
        case "SET_ERRORS" : {
            return {...state, serverErrors : action.payload}
        }
        default : {
            return { ...state }
        }
    }
}