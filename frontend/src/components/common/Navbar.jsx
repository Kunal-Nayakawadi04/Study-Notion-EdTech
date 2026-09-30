import React, { useState, useEffect, useRef } from 'react'
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { NavbarLinks } from "../../../data/navbar-links"
import studyNotionLogo from '../../assets/Logo/Logo-Full-Light.png'
import { fetchCourseCategories } from './../../services/operations/courseDetailsAPI'
import { logout } from './../../services/operations/authAPI'

import ProfileDropDown from '../core/Auth/ProfileDropDown'

import { AiOutlineShoppingCart, AiOutlineHome } from "react-icons/ai"
import { MdKeyboardArrowDown, MdOutlineContactPhone } from "react-icons/md"
import { HiMenuAlt1 } from "react-icons/hi"
import { IoMdClose } from "react-icons/io"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { TbMessage2Plus } from "react-icons/tb"
import { PiNotebook } from "react-icons/pi"
import Img from './Img'

const Navbar = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);

    const fetchSublinks = async () => {
        try {
            setLoading(true);
            const res = await fetchCourseCategories();
            setSubLinks(res);
        }
        catch (error) {
            console.log("Could not fetch the category list = ", error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchSublinks();
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setMobileCatalogOpen(false);
    }, [location.pathname]);

    // Route matcher helper
    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    }

    // Navbar scroll animation
    const [showNavbar, setShowNavbar] = useState('top');
    const [lastScrollY, setLastScrollY] = useState(0);

    const controlNavbar = () => {
        if (window.scrollY > 200) {
            if (window.scrollY > lastScrollY)
                setShowNavbar('hide');
            else setShowNavbar('show');
        } else {
            setShowNavbar('top');
        }
        setLastScrollY(window.scrollY);
    }

    useEffect(() => {
        window.addEventListener('scroll', controlNavbar);
        return () => {
            window.removeEventListener('scroll', controlNavbar);
        }
    }, [lastScrollY]);

    return (
        <>
            <nav className={`z-[30] flex h-14 w-full items-center justify-center border-b-[1px] border-b-richblack-700 bg-richblack-900 text-white translate-y-0 transition-all ${showNavbar} `}>
                <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img src={studyNotionLogo} alt="StudyNotion" className="w-[130px] sm:w-[160px] h-auto object-contain" loading='lazy' />
                    </Link>

                    {/* Nav Links - Desktop only */}
                    <ul className='hidden md:flex gap-x-6 text-richblack-25'>
                        {NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {link.title === "Catalog" ? (
                                    <div
                                        className={`group relative flex cursor-pointer items-center gap-1 ${
                                            matchRoute("/catalog/:catalogName")
                                                ? "bg-yellow-25 text-black rounded-xl p-1 px-3"
                                                : "text-richblack-25 rounded-xl p-1 px-3"
                                        }`}
                                    >
                                        <p>{link.title}</p>
                                        <MdKeyboardArrowDown />
                                        {/* Dropdown menu */}
                                        <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] 
                                                flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible 
                                                group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]"
                                        >
                                            <div className="absolute left-[50%] top-0 z-[100] h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                            {loading ? (
                                                <p className="text-center text-sm">Loading...</p>
                                            ) : Array.isArray(subLinks) && subLinks.length ? (
                                                <>
                                                    {subLinks.map((subLink, i) => (
                                                        <Link
                                                            to={`/catalog/${subLink?.name ? subLink.name.split(" ").join("-").toLowerCase() : ""}`}
                                                            className="rounded-lg bg-transparent py-2 pl-4 hover:bg-richblack-50 text-sm font-medium"
                                                            key={i}
                                                        >
                                                            <p>{subLink?.name || ""}</p>
                                                        </Link>
                                                    ))}
                                                </>
                                            ) : (
                                                <p className="text-center text-sm">No Courses Found</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Link to={link?.path}>
                                        <p className={`${matchRoute(link?.path) ? "bg-yellow-25 text-black" : "text-richblack-25"} rounded-xl p-1 px-3 `}>
                                            {link.title}
                                        </p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Right side buttons */}
                    <div className='flex items-center gap-x-2 sm:gap-x-4'>
                        {/* Cart icon (Student only) */}
                        {user && user?.accountType === "Student" && (
                            <Link to="/dashboard/cart" className="relative p-1">
                                <AiOutlineShoppingCart className="text-[2rem] text-richblack-5 hover:bg-richblack-700 rounded-full p-1 duration-200" />
                                {totalItems > 0 && (
                                    <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-[10px] font-bold text-yellow-100">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Desktop Auth Buttons */}
                        {token === null && (
                            <div className="hidden sm:flex items-center gap-x-3">
                                <Link to="/login">
                                    <button className={`px-[12px] py-[6px] text-sm text-richblack-100 rounded-md transition-all ${
                                        matchRoute('/login') ? 'border-[2px] border-yellow-50' : 'border border-richblack-700 bg-richblack-800 hover:bg-richblack-700'
                                    }`}>
                                        Log in
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <button className={`px-[12px] py-[6px] text-sm text-richblack-100 rounded-md transition-all ${
                                        matchRoute('/signup') ? 'border-[2px] border-yellow-50' : 'border border-richblack-700 bg-richblack-800 hover:bg-richblack-700'
                                    }`}>
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        )}

                        {/* Desktop Profile Dropdown */}
                        {token !== null && (
                            <div className="hidden sm:block">
                                <ProfileDropDown />
                            </div>
                        )}

                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-1 text-richblack-100 hover:text-white md:hidden text-2xl focus:outline-none"
                            aria-label="Toggle Navigation Menu"
                        >
                            {mobileMenuOpen ? <IoMdClose /> : <HiMenuAlt1 />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Backdrop */}
            {mobileMenuOpen && (
                <div
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 z-[40] bg-black/60 backdrop-blur-sm md:hidden"
                />
            )}

            {/* Mobile Drawer Menu */}
            <div
                className={`fixed top-0 right-0 z-[50] h-full w-[280px] sm:w-[320px] bg-richblack-800 p-6 text-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between ${
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div>
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-richblack-700">
                        <img src={studyNotionLogo} alt="StudyNotion" className="w-[120px]" />
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-2xl text-richblack-200 hover:text-white"
                        >
                            <IoMdClose />
                        </button>
                    </div>

                    {/* User Profile Summary if logged in */}
                    {token !== null && user && (
                        <div className="flex items-center gap-x-3 py-4 border-b border-richblack-700">
                            <Img
                                src={user?.image}
                                alt={`profile-${user?.firstName}`}
                                className="w-10 h-10 rounded-full object-cover border border-richblack-600"
                            />
                            <div className="min-w-0">
                                <p className="font-semibold text-sm text-richblack-5 truncate">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-richblack-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <div className="flex flex-col gap-y-1 py-4 text-sm font-medium">
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                                matchRoute('/') ? 'bg-yellow-50 text-richblack-900 font-semibold' : 'text-richblack-200 hover:bg-richblack-700'
                            }`}
                        >
                            <AiOutlineHome className="text-lg" />
                            Home
                        </Link>

                        {/* Catalog accordion in mobile */}
                        <div>
                            <button
                                onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
                                className="flex w-full items-center justify-between px-3 py-2.5 rounded-lg text-richblack-200 hover:bg-richblack-700 transition-colors"
                            >
                                <div className="flex items-center gap-x-3">
                                    <PiNotebook className="text-lg" />
                                    Catalog
                                </div>
                                <MdKeyboardArrowDown className={`text-lg transition-transform ${mobileCatalogOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {mobileCatalogOpen && (
                                <div className="pl-9 pr-3 py-1 flex flex-col gap-1 border-l-2 border-richblack-700 ml-4 my-1">
                                    {Array.isArray(subLinks) && subLinks.length ? (
                                        subLinks.map((subLink, idx) => (
                                            <Link
                                                key={idx}
                                                to={`/catalog/${subLink?.name ? subLink.name.split(" ").join("-").toLowerCase() : ""}`}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="py-1.5 text-xs text-richblack-300 hover:text-yellow-50"
                                            >
                                                {subLink?.name}
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-xs text-richblack-400 py-1">No Categories</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <Link
                            to="/about"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                                matchRoute('/about') ? 'bg-yellow-50 text-richblack-900 font-semibold' : 'text-richblack-200 hover:bg-richblack-700'
                            }`}
                        >
                            <TbMessage2Plus className="text-lg" />
                            About Us
                        </Link>

                        <Link
                            to="/contact"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                                matchRoute('/contact') ? 'bg-yellow-50 text-richblack-900 font-semibold' : 'text-richblack-200 hover:bg-richblack-700'
                            }`}
                        >
                            <MdOutlineContactPhone className="text-lg" />
                            Contact Us
                        </Link>

                        {/* Dashboard Link if logged in */}
                        {token !== null && (
                            <Link
                                to="/dashboard/my-profile"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                                    matchRoute('/dashboard/*') ? 'bg-yellow-50 text-richblack-900 font-semibold' : 'text-richblack-200 hover:bg-richblack-700'
                                }`}
                            >
                                <VscDashboard className="text-lg" />
                                Dashboard
                            </Link>
                        )}
                    </div>
                </div>

                {/* Footer Buttons in Mobile Drawer */}
                <div className="pt-4 border-t border-richblack-700 flex flex-col gap-2">
                    {token === null ? (
                        <>
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full text-center py-2.5 rounded-lg border border-richblack-600 bg-richblack-700 text-sm font-semibold text-richblack-100 hover:bg-richblack-600"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full text-center py-2.5 rounded-lg bg-yellow-50 text-sm font-semibold text-richblack-900 hover:bg-yellow-100"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                dispatch(logout(navigate));
                                setMobileMenuOpen(false);
                            }}
                            className="flex items-center justify-center gap-x-2 w-full py-2.5 rounded-lg border border-pink-700 bg-pink-900/30 text-pink-200 text-sm font-medium hover:bg-pink-900/50"
                        >
                            <VscSignOut className="text-lg" />
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}

export default Navbar
