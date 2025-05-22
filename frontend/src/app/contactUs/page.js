'use client';
import React, { use } from 'react'
import { useState } from 'react';

const ContactUs = () => {
    const [formData, setFormData] = useState({ firstName: '',lastName: '',  email: '', phone: '', companyName: '', message: '' });
    const [alert, setAlert] = useState({ message: '', type: '' });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/lead-form-submissions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`
                },
                body: JSON.stringify({
                    data: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        company: formData.companyName,
                        message: formData.message
                    }
                })
            });

            console.log("response", response);

            if (response.ok) {
                setAlert({ message: "Thank you! We've received your message and will get back to you soon.", type: 'success' });
                setTimeout(() => {
                    setAlert({ message: "", type: '' });
                }, 3000);
                setFormData({ firstName: '', lastName: '', email: '', phone: '', companyName: '', message: ''  });
            } else {                
                setAlert({ message: `Submission failed. ${response.statusText}`, type: 'error' });
                setTimeout(() => {
                    setAlert({ message: "", type: '' });
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            setAlert({ message: `Error Occurred.  ${error.statusText}`, type: 'error' });
            setTimeout(() => {
                setAlert({ message: "", type: '' });
            }, 3000);
        }
    };

    return (
        <div className="lg:w-1/2 md:w-2/3 mx-auto">
            {alert.message && (
                <div
                    className={`p-4 mb-4 text-sm rounded ${
                        alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                >
                    {alert.message}
                </div>
            )}
    <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap -m-2">
            <div className="p-2 w-1/2">
                <div className="relative">
                    <label htmlFor="firstName" className="leading-7 text-sm text-gray-600">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                </div>
            </div>
            <div className="p-2 w-1/2">
                <div className="relative">
                    <label htmlFor="lastName" className="leading-7 text-sm text-gray-600">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                </div>
            </div>
            <div className="p-2 w-1/2">
                <div className="relative">
                    <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                </div>
            </div>
            <div className="p-2 w-1/2">
                <div className="relative">
                    <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                </div>
            </div>
            <div className="p-2 w-full">
                <div className="relative">
                    <label htmlFor="companyName" className="leading-7 text-sm text-gray-600">Company Name</label>
                    <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                </div>
            </div>
            <div className="p-2 w-full">
                <div className="relative">
                    <label htmlFor="message" className="leading-7 text-sm text-gray-600">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    ></textarea>
                </div>
            </div>
            <div className="p-2 w-full">
                <button
                    type="submit"
                    className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                >
                    Submit
                </button>
            </div>
        </div>
    </form>
</div>
    );
};

export default ContactUs;