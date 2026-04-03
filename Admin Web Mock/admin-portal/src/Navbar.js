import React, { useState, useEffect } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Drones from './Pages/Drones';
import Zones from './Pages/Zones';
import './Navbar.css'; // Optional: add your own styling here

export default function Navbar({ BASE_URL,mapTrigger }) {
    
    return (
        <div>
            <BrowserRouter>
                <nav className="navbar">
                    <div className="navbar-content">
                        <NavLink to="/">Dashboard</NavLink>
                    </div>
                    <div className="navbar-content">
                    <NavLink to="/drones">Drones</NavLink>
                </div>
                <div className="navbar-content">
                    <NavLink to="/zones">Zones</NavLink>
                </div>
                <div className="navbar-content">
                    <NavLink to="/sightings">Sightings</NavLink>
                </div>
                <div className="navbar-content">
                    <NavLink to="/users">Users</NavLink>
                </div>
            </nav>
            <Routes>
                <Route path="/drones" element={<Drones />} />
                <Route path="/zones" element={<Zones BASE_URL={BASE_URL} mapTrigger={mapTrigger} />} />
                <Route path="/sightings" element={<div><h2>👀 Sightings</h2><p>Here you can view and manage all elephant sightings.</p></div>} />
                <Route path="/users" element={<div><h2>👥 Users</h2><p>Here you can view and manage all users in the system.</p></div>} />
                {/* Future: Add routes for sightings and users */}  
            </Routes>
            </BrowserRouter>
        </div>
    );
}