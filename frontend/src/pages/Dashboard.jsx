import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from "react-router-dom"
import Sidebar from '../components/core/Dashboard/Sidebar'
import Loading from '../components/common/Loading'

const Dashboard = () => {

    const { loading: authLoading } = useSelector((state) => state.auth);
    const { loading: profileLoading } = useSelector((state) => state.profile);


    if (profileLoading || authLoading) {
        return (
            <div className='mt-10'>
                <Loading />
            </div>
        )
    }
    // Scroll to the top of the page when the component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className='relative flex min-h-[calc(100vh-3.5rem)]'>
            <Sidebar />

            <div className='h-[calc(100vh-3.5rem)] overflow-auto w-full'>
                <div className='p-3 sm:p-6 md:p-10 pt-14 sm:pt-6 md:pt-10'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
