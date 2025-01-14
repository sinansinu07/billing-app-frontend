const initialState = {
    data: [],
    serverErrors: []
}

const productsReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_PRODUCTS' : {
            return {...state, data: action.payload}
        }
        case 'ADD_PRODUCT' : {
            return {...state, data: [...state.data, action.payload ]}
        }
        case 'SET_ERRORS' : {
            return {...state, serverErrors: action.payload }
        }
        case 'UPDATE_PRODUCT' : {
            return { ...state, data: state.data.map((ele) => {
                if(ele._id === action.payload._id) {
                    return action.payload 
                } else {
                    return ele 
                }
            })}
        }
        case 'REMOVE_PRODUCT' : {
            return { ...state, data : state.data.filter((ele) => {
                return ele._id !== action.payload._id
            })}
        }
        default: {
            return { ...state }
        }
    }
}

export default productsReducer