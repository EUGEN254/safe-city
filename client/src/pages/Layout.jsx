import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { useSafeCity } from '../context/SafeCity';
import { Outlet } from 'react-router-dom';
import UserNavbar from '../components/userComponents/UserNavbar';

const Layout = () => {
  const [isMobileSidebarOpen,setIsMobileSidebarOpen] = useState(false);
  const{user}= useSafeCity();
  return (
    <div>
      {/* sidebar */}
      <div>
        <Sidebar/>
      </div>


      {/* mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <div>
          <div></div>
          <div></div>
        </div>
      )}


      {/* main content area */}
      <div>
        {/* navbar */}
        <div>
          <UserNavbar/>
        </div>

        {/* main content area */}
        <div>
          <div>
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout