import axios from "axios"

export const startGetInvoices = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get("http://localhost:3070/api/invoices")
            dispatch(setInvoices(response.data))
        } catch(err) {
            alert(err.message)
        }
    }
}

const setInvoices = (data) => {
    return {
        type : "SET_INVOICES",
        payload : data
    }
}

export const startCreateInvoice = (formData, redirect) => {
    return async (dispatch) => {
        try {
            // console.log(formData)
            const response = await axios.post("http://localhost:3070/api/invoices", formData)
            console.log(response)
            dispatch(addInvoice(response.data))
            redirect()
        } catch(err) {
            console.log(err.response.data.errors)
            dispatch(setServerErrors(err.response.data.errors))
            alert(err)
        }
    }
}

const addInvoice = (data) => {
    return {
        type : "ADD_INVOICE",
        payload : data
    }
}

const setServerErrors = (errors) => {
    return {
        type : "SET_ERRORS",
        payload : errors
    }
}

export const startDeleteInvoice = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`http://localhost:3070/api/invoices/${id}`)
            dispatch(removeInvoice(response.data))
        } catch(err) {
            alert(err.message)
        }
    }
}

const removeInvoice = (invoice) => {
    return {
        type: 'REMOVE_INVOICE',
        payload : invoice
    }
}