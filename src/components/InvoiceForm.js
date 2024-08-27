import { useState, useReducer, useContext, useEffect } from 'react' 
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
// import { Container, Row, Col } from 'reactstrap'
import CustomersContext from './contexts/CustomerContext'
import { startCreateInvoice } from '../actions/invoicesAction'
import { setServerErrors } from '../actions/productsAction'

Array.prototype.findErrors = function(name) {
    let result = []
    this.forEach(ele => {
        if(ele.path === name) {
            result.push(ele.msg)
        }
    })
    return result.join(", ")
    // for(let i = 0; i < this.length; i++) {
    //     let result = ""
    //     if(this[i].path === name) {
    //         result += this[i].msg
    //     }
    //     return result
    // }
}

const invoiceFormReducer = (state, action) => {
    switch(action.type) {
        case 'HANDLE_CHANGE' : {
            return {...state, [action.payload.name]: action.payload.value }
        }
        case 'ADD_ITEM' : {
            return {...state, lineItems: [...state.lineItems, action.payload ]}
        }
        case 'UPDATE_ITEM' : {
            return { ...state, lineItems: state.lineItems.map((ele) => {
                if(ele._id === action.payload) {
                    return {...ele, quantity: ele.quantity + 1}
                } else {
                    return ele 
                }
            })}
        }
        case 'INCREMENT' : {
            return {...state, lineItems: state.lineItems.map((ele) => {
                if(ele._id === action.payload) {
                        return {...ele, quantity: ele.quantity + 1}
                } else { 
                    return ele 
                }
            })}
        }
        case 'DECREMENT' : {
            return {...state, lineItems: state.lineItems.map((ele) => {
                if(ele._id === action.payload) {
                        return {...ele, quantity: ele.quantity - 1}
                } else { 
                    return ele 
                }
            })}
        }
        case 'REMOVE_ITEM' : {
            return {...state, lineItems: state.lineItems.filter(ele => ele._id !== action.payload)}
        }
        default: {
            return {...state}
        }
    }
}

export default function InvoiceForm(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { customers } = useContext(CustomersContext)
    const [search, setSearch] = useState('')
    const [invoiceForm, invoiceDispatch] = useReducer(invoiceFormReducer, {
        customer: '',
        lineItems: [],
        taxes: '',
        discount: ''
    })

    const products = useSelector((state) => {
        return state.products
    })

    const serverErrors = useSelector((state) => {
        return state.products.serverErrors
    })

    useEffect(()=> {
        (async () => {
            dispatch(setServerErrors([]))
        })()
    }, [dispatch])

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('submit', e)
        // client side validations 
        // const reset = () => {
        //     // reset form info 
        // }
       const formData = {...invoiceForm}
       formData.lineItems = formData.lineItems.map((ele) => {
        return {
            product: ele._id, 
            quantity: ele.quantity
        }
       })

       const redirect = () => {
        navigate('/invoices')
       }
       
       dispatch(startCreateInvoice(formData, redirect))
       
    }

    const handleChange = (e) => {
        const { name, value} = e.target
        // setForm({...form, [name]: value })
        invoiceDispatch({ type: 'HANDLE_CHANGE', payload: { name, value }})
    }

    const handleAdd = (id) => {
        const product = products.data.find(ele => ele._id === id)
        const item = { _id: product._id, name: product.name, price: product.price, quantity: 1}
        const inLineItem = invoiceForm.lineItems.find(ele => ele._id === product._id) 
        if(inLineItem) {
            invoiceDispatch({ type: 'UPDATE_ITEM', payload: inLineItem._id})
        } else {
            invoiceDispatch({ type: 'ADD_ITEM', payload: item })
        }
        setSearch('')
    }

    const handleRemove = (id) => {
        const userConfirm = window.confirm("Are you sure?")
        if(userConfirm) {
            invoiceDispatch({ type: 'REMOVE_ITEM', payload: id })
        }
    }

    const calculateGrossTotal = () => {
        const result = invoiceForm.lineItems.reduce((acc, cv) => {
            return acc + cv.price * cv.quantity
        }, 0)
        // invoiceDispatch({ type: 'HANDLE_CHANGE', payload: { name: 'grossTotal', value: result }})
        return result 
    }

    const calculateNetTotal = () => {
        const grossTotal = invoiceForm.lineItems.reduce((acc, cv) => {
            return acc + cv.price * cv.quantity
        }, 0)
        const deductions = grossTotal * invoiceForm.discount / 100 
        const additions = grossTotal * invoiceForm.taxes / 100 
        return grossTotal - deductions + additions
    }

   
    return (
        <div className="row">
            <div className="col-md-9 offset-md-2">
                <div className="row">
                    <h2>Add Invoice</h2>
                    <input 
                        className="form-control" 
                        type="text" 
                        value={search} 
                        onChange={(e) => { setSearch(e.target.value) }}
                        placeholder="Search by product name..."
                    />
                    { search && (
                        <ul className="list-group">
                            { products.data.filter(ele => ele.name.toLowerCase().includes(search.toLowerCase())).map((ele) => {
                                return <li  className="list-group-item" key={ele._id} onClick={() => {
                                    handleAdd(ele._id)
                                }}>{ele.name}</li>
                            })}
                        </ul>
                    )}
                    <div className="col-md-8">
                        <div className="form-group">
                            <label>Customer</label>
                            <select 
                                value={invoiceForm.customer}
                                onChange={handleChange} 
                                name="customer"
                                className={"form-select" + (serverErrors.findErrors("customer") ? " is-invalid" : "")}
                            >
                                <option value="">Select</option>
                                { customers.data.map((ele) => {
                                    return <option key={ele._id} value={ele._id}>{ele.name}</option>
                                })}
                            </select>
                            {serverErrors.length > 0 && <div className="invalid-feedback">{serverErrors.findErrors("customer")}</div>}
                        </div>

                    { invoiceForm.lineItems.length > 0 && (
                        <>
                        <h3>Line Items</h3>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { invoiceForm.lineItems.map((ele) => {
                                        return (
                                            <tr key={ele._id}>
                                                <td>{ele.name}</td>
                                                <td>{ele.price}</td>
                                                <td>
                                                <button 
                                                    onClick={(e) => {
                                                        console.log('click', e)
                                                        invoiceDispatch({ type: 'DECREMENT', payload: ele._id })
                                                    }}
                                                    disabled={ele.quantity === 1}
                                                    > - </button>    

                                                    {ele.quantity}

                                                    <button onClick={(e) => {
                                                        invoiceDispatch({ type: 'INCREMENT', payload: ele._id })
                                                    }}>+</button>        
                                                </td>
                                                <td>{ ele.price * ele.quantity }</td>
                                                <td><button onClick={() => {
                                                    handleRemove(ele._id)
                                                }}>remove</button></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </>
                    )}
                    
                    <div className="form-group">
                        <label className="form-label">Discount</label>
                        <input 
                            type="text" 
                            value={invoiceForm.discount} 
                            name="discount" 
                            onChange={handleChange} 
                            className={"form-select" + (serverErrors.findErrors("discount") ? " is-invalid" : "")}
                        />
                        {serverErrors.length > 0 && <div className="invalid-feedback">{serverErrors.findErrors("discount")}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Taxes</label>
                        <select 
                            value={invoiceForm.taxes} 
                            name="taxes" 
                            onChange={handleChange}
                            className={"form-select" + (serverErrors.findErrors("taxes") ? " is-invalid" : "")}  
                        >
                            <option value="">Select</option>
                            <option value="5">5%</option>
                            <option value="18">18%</option>
                        </select>
                        {serverErrors.length > 0 && <div className="invalid-feedback">{serverErrors.findErrors("taxes")}</div>}
                    </div> 
                    <button onClick={handleSubmit}> submit </button>
                    </div>
                    <div className="col-md-4">
                        <h2>Gross Total - { calculateGrossTotal() } </h2>
                        <p>Discount - { invoiceForm.discount }</p>
                        <p>Taxes - { invoiceForm.taxes } </p>
                        <h2>Net Total - { calculateNetTotal() }</h2>
                    </div>
                </div>
                        
            
            </div>
        </div>
    )
}

// import { useState, useReducer, useContext, useEffect } from 'react' 
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router'
// import { Container, Row, Col } from 'reactstrap'
// import CustomersContext from './contexts/CustomerContext'
// import { startCreateInvoice } from '../actions/invoicesAction'
// import { setServerErrors } from '../actions/productsAction'

// Array.prototype.findErrors = function(name) {
//     let result = []
//     this.forEach(ele => {
//         if(ele.path === name) {
//             result.push(ele.msg)
//         }
//     })
//     return result.join(", ")
//     // for(let i = 0; i < this.length; i++) {
//     //     let result = ""
//     //     if(this[i].path === name) {
//     //         result += this[i].msg
//     //     }
//     //     return result
//     // }
// }

// const invoiceFormReducer = (state, action) => {
//     switch(action.type) {
//         case 'HANDLE_CHANGE' : {
//             return {...state, [action.payload.name]: action.payload.value }
//         }
//         case 'ADD_ITEM' : {
//             return {...state, lineItems: [...state.lineItems, action.payload ]}
//         }
//         case 'UPDATE_ITEM' : {
//             return { ...state, lineItems: state.lineItems.map((ele) => {
//                 if(ele._id === action.payload) {
//                     return {...ele, quantity: ele.quantity + 1}
//                 } else {
//                     return ele 
//                 }
//             })}
//         }
//         // case 'INCREMENT' : {
//         //     return {...state, lineItems: state.lineItems.map((ele) => {
//         //         if(ele._id === action.payload) {
//         //                 return {...ele, quantity: ele.quantity + 1}
//         //         } else { 
//         //             return ele 
//         //         }
//         //     })}
//         // }
//         // case 'DECREMENT' : {
//         //     return {...state, lineItems: state.lineItems.map((ele) => {
//         //         if(ele._id === action.payload) {
//         //                 return {...ele, quantity: ele.quantity - 1}
//         //         } else { 
//         //             return ele 
//         //         }
//         //     })}
//         // }
//         case 'REMOVE_ITEM' : {
//             return {...state, lineItems: state.lineItems.filter(ele => ele._id !== action.payload)}
//         }
//         default: {
//             return {...state}
//         }
//     }
// }

// export default function InvoiceForm(){
//     const dispatch = useDispatch()
//     const navigate = useNavigate()
//     const { customers } = useContext(CustomersContext)
//     const [search, setSearch] = useState('')
//     const [invoiceForm, invoiceDispatch] = useReducer(invoiceFormReducer, {
//         customer: '',
//         lineItems: [],
//         taxes: '',
//         discount: '',
//         grossTotal: '',
//         netTotal: ''
//     })

//     const products = useSelector((state) => {
//         return state.products
//     })
    // const serverErrors = useSelector((state) => {
    //     return state.products.serverErrors
    // })

    // useEffect(()=> {
    //     (async () => {
    //         dispatch(setServerErrors([]))
    //     })()
    // }, [dispatch])

//     const handleSubmit = (e) => {
//         debugger
//         e.preventDefault()
//         const formData = {...invoiceForm}
//         formData.lineItems = invoiceForm.lineItems.map((ele) => {
//             return {
//                 product : ele._id,
//                 quantity : ele.quantity
//             }
//         })
//         const redirect = () => {
//             navigate('/invoices')
//            }
    
//         // console.log(formData)
//         dispatch(startCreateInvoice(formData, redirect))
        
//     }

//     const handleChange = (e) => {
//         const { name, value} = e.target
//         // setForm({...form, [name]: value })
//         console.log("handleChange")
//         invoiceDispatch({ type: 'HANDLE_CHANGE', payload: { name, value }})
//     }

//     const handleAdd = (id) => {
//         const product = products.data.find(ele => ele._id === id)
//         const item = { _id: product._id, name: product.name, price: product.price, quantity: 1}
//         const inLineItem = invoiceForm.lineItems.find(ele => ele._id === product._id) 
//         if(inLineItem) {
//             invoiceDispatch({ type: 'UPDATE_ITEM', payload: inLineItem._id})
//         } else {
//             invoiceDispatch({ type: 'ADD_ITEM', payload: item })
//         }
//         setSearch('')
//     }

//     const handleRemove = (id) => {
//         const userConfirm = window.confirm("Are you sure?")
//         if(userConfirm) {
//             invoiceDispatch({ type: 'REMOVE_ITEM', payload: id })
//         }
//     }

//     const calculateGrossTotal = () => {
//         const result = invoiceForm.lineItems.reduce((acc, cv) => {
//             return acc + cv.price * cv.quantity
//         }, 0)
//         // invoiceDispatch({ type: 'HANDLE_CHANGE', payload: { name: 'grossTotal', value: result }})
//         return result 
//     }

//     const calculateNetTotal = () => {
//         const grossTotal = invoiceForm.lineItems.reduce((acc, cv) => {
//             return acc + cv.price * cv.quantity
//         }, 0)
//         const dedudction = grossTotal * invoiceForm.discount / 100
//         const addidtion = grossTotal * invoiceForm.taxes / 100
//         const result = grossTotal - dedudction + addidtion

//         return result
//     }

   
//     return (
//         <div className="row-md-6">
//             <input className="form-search" type="text" value={search} onChange={(e) => { setSearch(e.target.value) }} placeholder="Enter product name" />
//             { search && (
//                 <ul>
//                     { products.data.filter(ele => ele.name.toLowerCase().includes(search.toLowerCase())).map((ele) => {
//                         return <li key={ele._id} onClick={() => {
//                             handleAdd(ele._id)
//                         }}>{ele.name}</li>
//                     })}
//                 </ul>
//             )}
            
//             {/* {
//                 serverErrors.length > 0 && (
//                     <div>
//                         These errors prohibited the form from being saved: 
//                         <ul>
//                             { serverErrors.map((ele, i) => {
//                                 return <li key={i}> { ele.msg }</li>
//                             })}
//                         </ul>
//                     </div>
//                 )
//             } */}
        
//             <form onSubmit={handleSubmit}>
//                 <div className="form-group col-md-4">
//                     <label className='form-label' htmlFor="customer">Customer</label>
//                     <select value={invoiceForm.customer} 
//                             onChange={handleChange} 
//                             name="customer"
//                             className={"form-select" + (serverErrors.findErrors("customer") ? " is-invalid" : "")}>
//                         <option value="">Select</option>
//                         { customers.data.map((ele) => {
//                             return <option value={ele._id} key={ele._id}>{ele.name}</option>
//                         })}
//                     </select>
//                 {serverErrors.length > 0 && <div className="invalid-feedback">{serverErrors.findErrors("customer")}</div>}
//                 </div>
//                 <h3>Line Items</h3>
//                 <table className='table'>
//                     <thead>
//                         <tr>
//                             <th>Name</th>
//                             <th>Price</th>
//                             <th>Quantity</th>
//                             <th>Total</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         { invoiceForm.lineItems.map((ele) => {
//                             return (
//                                 <tr key={ele._id}>
//                                     <td>{ele.name}</td>
//                                     <td>{ele.price}</td>
//                                     <td>
//                                     <button 
//                                         onClick={() => {
//                                             // invoiceDispatch({ type: 'DECREMENT', payload: ele._id })
//                                         }}
//                                         disabled={ele.quantity === 1}
//                                         > - </button>    

//                                         {ele.quantity}

//                                         <button onClick={() => {
//                                             // invoiceDispatch({ type: 'INCREMENT', payload: ele._id })
//                                         }}> + </button>        
//                                     </td>
//                                     <td>{ ele.price * ele.quantity }</td>
//                                     <td><button onClick={() => {
//                                         handleRemove(ele._id)
//                                     }}>remove</button></td>
//                                 </tr>
//                             )
//                         })}
//                     </tbody>
//                 </table>

//                 <div className="form-group col-md-4">
//                     <label className="form-label" htmlFor='invoiceForm.discount'>Discount</label>
//                     <input 
//                         type="text"
//                         value={invoiceForm.discount}
//                         name="discount"
//                         onChange={handleChange}
//                         className={"form-select" + (serverErrors.findErrors("discount") ? " is-invalid" : "")}
//                     />
//                 {serverErrors.length > 0 && <div className="invalid-feedback">{serverErrors.findErrors("discount")}</div>}
//                 </div>

//                 <div className="form-group col-md-4">
//                     <label className="form-label" htmlFor="invoiceForm.taxes">Taxes</label>
//                     <select className={"form-select" + (serverErrors.findErrors("taxes") ? " is-invalid" : "")}
//                             value={invoiceForm.taxes} 
//                             name="taxes" 
//                             onChange={handleChange}>
//                         <option value="">Select</option>
//                         <option value="5">5%</option>
//                         <option value="10">10%</option>
//                     </select>
//                 {serverErrors.length > 0 && <div className="invalid-feedback">{serverErrors.findErrors("taxes")}</div>}
//                 </div>
//                 <input type="submit" className="btn btn-primary mt-2"/>
//             </form>

//             <Container>
//             <Row>
//                 <Col>
//                 <h2 className="nb-4">Gross Total - { calculateGrossTotal() } </h2>
//                 <p className="nb-3">Discount - { invoiceForm.discount }</p>
//                 <p className="nb-3">Taxes - { invoiceForm.taxes } </p>
//                 <h2 className="total-amount">Net Total - { calculateNetTotal() }</h2>
//                 </Col>
//             </Row>
//             </Container>
           
//         </div>
//     )
// }

// className={"form-select" + (serverErrors.findErrors("customer") ? " is-invalid" : "")}>
//                         <option value="">Select</option>
//                         { customers.data.map((ele) => {
//                             return <option value={ele._id} key={ele._id}>{ele.name}</option>
//                         })}
//                     </select>
//                 {serverErrors.length > 0 && <div className="invalid-feedback">{serverErrors.findErrors("customer")}</div>}