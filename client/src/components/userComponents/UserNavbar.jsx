import React from 'react'
import { useSafeCity } from '../../context/SafeCity'

const UserNavbar = () => {
  const {logout} = useSafeCity()
  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default UserNavbar