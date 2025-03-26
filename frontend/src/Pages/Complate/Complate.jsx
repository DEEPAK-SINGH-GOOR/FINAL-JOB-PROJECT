import React, { useContext, useState } from 'react';
import "./Complate.css";
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import Cookies from 'js-cookie';
import { Bounce, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Complate = () => {
    const nav = useNavigate()
    const { url } = useContext(StoreContext)
    const [formData, setFormData] = useState({
        companyName: "",
        street: "",
        state: "",
        country: "",
        zipCode: "",
        city: "",
        companyEmail: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = Cookies.get("token");
        console.log("token", token);

        if (!token) {
            alert("No token found. Please log in.");
            return;
        }

        try {
            let res = await axios.post(`${url}/api/v1/address/create`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            toast.success("Profile Updated Successfully...", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });

            nav("/")
            setFormData({
                companyName: "",
                street: "",
                state: "",
                country: "",
                zipCode: "",
                city: "",
                companyEmail: ""
            });
        } catch (error) {
            console.error(error);
            alert("Failed to submit form");
        }
    };



    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Company Details</h2>
                <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required />
                <input type="text" name="street" placeholder="Street" value={formData.street} onChange={handleChange} required />
                <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
                <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />
                <input type="text" name="zipCode" placeholder="Zip Code" value={formData.zipCode} onChange={handleChange} required />
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                <input type="email" name="companyEmail" placeholder="Company Email" value={formData.companyEmail} onChange={handleChange} required />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Complate;