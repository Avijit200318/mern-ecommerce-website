import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import CreateProduct from './pages/CreateProduct';
import Product from './pages/Product';
import UserProducts from './pages/UserProducts';
import UpdateProduct from './pages/UpdateProduct';
import Order from './pages/Order';
import OrderConform from './pages/OrderConform';
import OrderDetails from './pages/OrderDetails';

const App = () => {
  return <BrowserRouter >
    <Header />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/sign-in' element={<SignIn />} />
      <Route path='/sign-up' element={<SignUp />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/product/:productId' element={<Product />} />
      <Route element={<PrivateRoute />}>
        <Route path='/cart' element={<Cart />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/create-product' element={<CreateProduct />} />
        <Route path='/userProducts' element={<UserProducts />} />
        <Route path='/updateProduct/:productId' element={<UpdateProduct />} />
        <Route path='/order' element={<Order />} />
        <Route path='/orderCon/:productId' element={<OrderConform />} />
        <Route path='/orderDetails/:OrderId' element={<OrderDetails />} />
      </Route>
    </Routes>
  </BrowserRouter>
}

export default App
