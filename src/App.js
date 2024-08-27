import { useEffect, useReducer } from 'react'
import { useDispatch } from 'react-redux';
import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios';

import { startGetProducts } from './actions/productsAction';
import { startGetInvoices } from './actions/invoicesAction';

import Dashboard from './components/Dashboard';
import ProductsContainer from './components/ProductsContainer';
import CustomerContainer from './components/CustomersContainer';
import CustomerShow from './components/CustomerShow';
import InvoiceContainer from './components/InvoiceContainer';
import InvoiceForm from './components/InvoiceForm';

import customerReducer from './reducers/customerReducer';
import CustomerContext from './components/contexts/CustomerContext';


function App() {
  const dispatch = useDispatch()
  const [customers, customerDispatch] = useReducer(customerReducer, { data : [], serverErrors : [] })

  useEffect(() => {
    dispatch(startGetProducts());
    dispatch(startGetInvoices());
    (async () => {
      try {
        const response = await axios.get("http://localhost:3070/api/customers")
        customerDispatch({
          type : "SET_CUSTOMERS",
          payload : response.data
        })
      } catch(err) {
        console.log(err)
      }
    }) ()
  }, [dispatch])
  return (
    <CustomerContext.Provider value={{customers, customerDispatch }}>
      <div className="App">
        <h1>Billing App</h1><br/>
        <Link to="/dashboard">Dashboard</Link> | {" "}
        <Link to="/products">Products</Link> | {" "}
        <Link to="/customers">Customers</Link> | {" "}
        <Link to="/invoices">Invoices</Link> | {" "}
        <Link to="/invoices/new">Add Invoice</Link> <hr/>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/products" element={<ProductsContainer />}/>
          <Route path="/customers" element={<CustomerContainer />}/>
          <Route path="/customers/show/:id" element={<CustomerShow />} />
          <Route path="/invoices" element={<InvoiceContainer />} />
          <Route path="/invoices/new" element={<InvoiceForm />} />
        </Routes>
      </div>
     </CustomerContext.Provider>
    
  );
}

export default App;