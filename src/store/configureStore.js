import { createStore, combineReducers, applyMiddleware } from 'redux'
import {thunk} from 'redux-thunk'
import productsReducer from '../reducers/productsReducer'
import invoicesReducer from '../reducers/invoicesReducer'
const configureStore = () => {
    const store = createStore(combineReducers({
        products : productsReducer,
        invoices : invoicesReducer
    }), applyMiddleware(thunk))
    return store 
}

export default configureStore