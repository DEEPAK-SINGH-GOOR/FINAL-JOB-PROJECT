import React, { useContext, useEffect, useState } from 'react';
import "./App.css";
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { StoreContext } from './context/StoreContext';
import Home from './Pages/Home/Home';
import Assign from './Pages/Assign/Assign';
import Signup from './Pages/Signup/Signup';
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import Profile from './Pages/Profile/Profile';
import Complate from './Pages/Complate/Complate';
import AppliedTasksPage from './Pages/Applied/Applied';
import Requests from './Pages/Requests/Requests';
import MyTasks from './Pages/MyTasks/MyTasks';
import Update from './Pages/Update/Update';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import PageNotFound from './Pages/PageNotFound/PageNotFound';
import Navbar from './Components/Navbar/Navbar';
import Verify from './Pages/Verify/Verify';
// import Home from "./Pages/Home/Home"
// import Assign from "./Pages/Assign/Assign"
// import Signup from "./Pages/Signup/Signup"
// import Login from "./Pages/Login/Login"
// import Dashboard from "./Pages/Dashboard/Dashboard"
// import Profile from "./Pages/Profile/Profile"
// import Verify from "./Pages/Verify/Verify"
// // import Dashboard from "./Pages/"
// // import Dashboard from "./Pages/"
// // import Dashboard from "./Pages/"

const App = () => {
  const { url } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);

  const fetchTemp = async () => {
    try {
      setLoading(true);
      let res = await fetch(`${url}/api/v1/tasks`);
      console.log(res);
      
      // let res = await fetch(`${url}`);
      if (res.ok) {
        setLoading(false); 
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemp();
  }, []);

  return (
    <div>
      {loading ? (
        <div className='loader-main'>
          <div className='loader'></div>
        </div>
      ) : (
        <div>
          <ToastContainer />
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/assign' element={<Assign />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/complite' element={<Complate />} />
            <Route path='/applied' element={<AppliedTasksPage />} />
            {/* <Route path='/requests' element={<Requests />} />0 */}
            <Route path="/requests/:taskId" element={<Requests />} />
            <Route path="/my-tasks" element={<MyTasks />} />
            <Route path="/update" element={<Update />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default App;
