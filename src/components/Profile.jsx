import React from 'react'
import Navbar from './layout/Navbar'
import useCurrentUser from '../utils/useCurrentUser'

export default function Profile() {
  const { user } = useCurrentUser()

  return (
    <>
      <Navbar user={user} />
      <div className="min-h-[80vh] bg-gray-100 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 p-6 rounded-xl shadow-xl text-white mb-6">
            <h2 className="text-3xl font-bold mb-2">Hello, {user?.username}!</h2>
            <p className="text-lg opacity-90">Welcome to your profile dashboard</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Username Card */}
            <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300">
              <p className="text-gray-400 text-sm uppercase">Username</p>
              <h3 className="text-xl font-semibold mt-2 text-gray-800">{user?.username}</h3>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300">
              <p className="text-gray-400 text-sm uppercase">Email</p>
              <h3 className="text-xl font-semibold mt-2 text-gray-800">{user?.email}</h3>
            </div>

            {/* Role Card */}
            <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300">
              <p className="text-gray-400 text-sm uppercase">Role</p>
              <span className={`mt-2 px-4 py-1 rounded-full text-white font-semibold
                ${user?.role === 'admin' ? 'bg-red-500' : 'bg-sky-500'}`}>
                {user?.role}
              </span>
            </div>
          </div>

          <div className="mt-10 text-center text-gray-500">
            <p>Manage your account and tasks here.</p>
          </div>
        </div>
      </div>
    </>
  )
}
