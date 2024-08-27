import { useState } from 'react' 
import { useDispatch, useSelector } from 'react-redux'
import { startCreateProduct, startUpdateProduct } from '../actions/productsAction'
// import 'bootstrap/dist/css/bootstrap.min.css';

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

export default function ProductForm(props) {
    const dispatch = useDispatch()
    // name, price, description, stockLevel, reorderLevel
    const serverErrors = useSelector((state) => {
        return state.products.serverErrors
    })

    const product = useSelector((state) => {
        return state.products.data.find(ele => ele._id === props.editId )
    })

    const [form, setForm] = useState(product ? {
        name: product.name,
        price: product.price,
        description: product.description,
        stockLevel: product.stockLevel,
        reorderLevel: product.reorderLevel
    } : {
        name: '',
        price: '',
        description: '',
        stockLevel: '',
        reorderLevel: ''
    })

    const handleChange = (e) => {
        const {name, value} = e.target
        setForm({...form, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // run client validations 

        const resetForm = () => {
            setForm({ 
                name: '',
                price: '',
                description: '',
                reorderLevel: '',
                stockLevel: ''
            })
        }
        if(product) {
            dispatch(startUpdateProduct(product._id, form, resetForm, props.toggle))
        } else {
            dispatch(startCreateProduct(form, resetForm))      
        }
    }

    return (
        <>
            <h2>Add Product</h2>
            {/* {
                serverErrors.length > 0 && (
                    <div>
                        These errors prohibited the form from being saved: 
                        <ul>
                            { serverErrors.map((ele, i) => {
                                return <li key={i}> { ele.msg }</li>
                            })}
                        </ul>
                    </div>
                )
            } */}
            <form >
                <div className="form-group">
                    <label 
                        className="form-label"
                        htmlFor="name"
                    >Name</label>
                    <input 
                        type="text" 
                        value={form.name} 
                        onChange={handleChange} 
                        name="name" 
                        className={"form-control" + (serverErrors && serverErrors.findErrors("name") ? " is-invalid" : "")}
                        id="name"
                    />
                    {serverErrors && <div className="invalid-feedback">{serverErrors.findErrors("name")}</div>}
                </div>
                <div className="form-group">
                    <label 
                        className="form-label"
                        htmlFor="price"    
                    >Price</label>
                    <input 
                        type="text" 
                        value={form.price} 
                        onChange={handleChange} 
                        name="price" 
                        id="price"
                        className={"form-control" + (serverErrors && serverErrors.findErrors("price") ? " is-invalid" : "")}
                    />
                    {serverErrors && <div className="invalid-feedback">{serverErrors.findErrors("price")}</div>}
                </div>
                <div className="form-group">
                    <label
                        className="form-label"
                        htmlFor="description"
                    >Description</label>
                    <textarea
                        className="form-control"
                        value={form.description}
                        onChange={handleChange} 
                        name="description"
                        id="description"
                    >
                    </textarea>
                </div>
                <div className="form-group">
                    <label 
                        className="form-label"
                        htmlFor="stockLevel"    
                    >Stock Level</label>
                    <input 
                        type="text" 
                        value={form.stockLevel} 
                        onChange={handleChange} 
                        name="stockLevel" 
                        id="stockLevel"
                        className={"form-control" + (serverErrors && serverErrors.findErrors("stockLevel") ? " is-invalid" : "")}
                    />
                    {serverErrors && <div className="invalid-feedback">{serverErrors.findErrors("stockLevel")}</div>}
                </div>
                <div className="form-group">
                    <label 
                        className="form-label"
                        htmlFor="reorderLevel"    
                    >Reorder Level</label>
                    <input 
                        type="text" 
                        value={form.reorderLevel} 
                        onChange={handleChange} 
                        name="reorderLevel" 
                        id="reorderLevel"
                        className={"form-control" + (serverErrors && serverErrors.findErrors("reorderLevel") ? " is-invalid" : "")}
                    />
                    {serverErrors && <div className="invalid-feedback">{serverErrors.findErrors("reorderLevel")}</div>}
                </div>
                <input onClick={handleSubmit} type="submit" className="btn btn-primary" />
            </form>
        </>
    )
}