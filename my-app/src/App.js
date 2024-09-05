// import './App.css';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import React from 'react';
// import Login from './components/Login';
// import Dashboard from '../components/Dashboard';

// function App() {
//   return (
//     <Router>
//         <Routes>
//             <Route path="/" element={<Login />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//         </Routes>
//     </Router>
// );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import AgentDashboard from './components/AgentDashboard';
import Dashboard from './components/Dashboard';
import { UserContextProvider } from './UserContext';
import axios from 'axios';

const App = () => {
    return (
        <Router>
            <UserContextProvider>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboardAgent" element={<AgentDashboard />} />
            </Routes>
            </UserContextProvider>
        </Router>
    );
};

export default App









