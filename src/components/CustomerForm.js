import { useContext, useEffect, useState } from "react"
import CustomerContext from "./contexts/CustomerContext"
import axios from "axios"
import { findErrors } from "../utils/findErrors"


export default function CustomerForm() {
    const { customers, customerDispatch } = useContext(CustomerContext)
    const serverErrors = customers.serverErrors
    const [form, setForm] = useState({
        name : "",
        email : "",
        mobile : "",
    })
    console.log(serverErrors)

    useEffect(() => {
        return () => {
            customerDispatch({
                type : "SET_ERRORS",
                payload : []
            })
        }
    }, [customerDispatch])
    const handleChange = (e) => {
        const {name, value} = e.target
        setForm({...form, [name]: value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = {
            name : form.name,
            contact : {
                email : form.email,
                mobile : form.mobile
            }
        }
        try {
            const response = await axios.post("http://localhost:3070/api/customers", formData)
            customerDispatch({
                type : "ADD_CUSTOMER",
                payload : response.data
            })
            customerDispatch({
                type : "SET_ERRORS",
                payload : []
            })
        } catch(err) {
            customerDispatch({
                type : "SET_ERRORS",
                payload : err.response.data.errors
            })
            console.log(err.response.data.errors)
        }
    }

    return (
        <>
            <h2>Add Customer</h2>
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
                        className={"form-control" + (serverErrors.findErrors("name") ? " is-invalid" : "")} 
                        id="name"
                    />
                    {serverErrors.length > 0 && <div className="invalid-feedback">{serverErrors.findErrors("name")}</div>}
                </div>
                <div className="form-group">
                    <label 
                        className="form-label"
                        htmlFor="email"    
                    >Email</label>
                    <input 
                        type="text" 
                        value={form.email} 
                        onChange={handleChange} 
                        name="email" 
                        id="email"
                        className={"form-control" + (serverErrors.findErrors("contact.email") ? " is-invalid" : "")}
                    />
                    {serverErrors && <div className="invalid-feedback">{serverErrors.findErrors("contact.email")}</div>}
                </div>
                <div className="form-group">
                    <label
                        className="form-label"
                        htmlFor="Mobile"
                    >Mobile</label>
                    <input
                        type="text"
                        className={"form-control" + (serverErrors.findErrors("contact.mobile") ? " is-invalid" : "")}
                        value={form.mobile}
                        onChange={handleChange} 
                        name="mobile"
                        id="mobile"
                    />
                    {serverErrors && <div className="invalid-feedback">{serverErrors.findErrors("contact.mobile")}</div>}
                </div>
                <input onClick={handleSubmit} type="submit" className="btn btn-primary" />
            </form>
        </>
    )
}