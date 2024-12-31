import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

//react icons
import { FaBarsStaggered, FaBlog, FaXmark } from "react-icons/fa6";
import { AuthContext } from '../contacts/AuthProviders';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    const { user } = useContext(AuthContext)

    //toggle menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsSticky(true);
            }
            else {
                setIsSticky(false);
            }
        }

        window.addEventListener("scroll", handleScroll);


        return () => {
            window.addEventListener("scroll", handleScroll);
        }

    }, [])

    //navItems

    const navItems = [
        { Link: "Home", path: "/" },
        { Link: "About", path: "/about" },
        { Link: "Tests", path: "/tests" },
        { Link: "Calendar", path: "/calendar" },
        { Link: "Profile", path: "/admin/dashboard" },
        { Link: "Health Care", path: "/map" }
    ]

    return (
        <header className='w-full bg-transparent fixed top-0 left-0 right-0 transmition-all ease-in duration-300'>
            <nav className={`py-4 lg:px-24 px-4 ${isSticky ? "sticky top-0 left-0 right-0 bg-blue-300" : ""}`}>
                <div className='flex justify-between items-center text-base gap-8'>
                    {/* logo */}
                    <Link to='/' className='text-2xl font-bold text-blue-700 flex items-center gap-2 '>Mental Well Being</Link>

                    {/*nav item for large device*/}

                    <ul className='md:flex space-x-12 hidden'>
                        {navItems.map(({ Link, path }) => (
                            <a key={path} href={path} className='block text-base text-black uppercase cursor-pointer hover:text-blue-700'>{Link}</a>
                        ))}


                    </ul>

                    {/* Button for lg devices when menu is not open*/}

                    <div className='space-x-12 hidden lg:flex items-center'>

                        <button><FaBarsStaggered className='w-5 hover:text-blue-700' /></button>
                        {
                            user ? user.email : ""
                        }
                    </div>


                    {/*menu btn for the mobile devices */}
                    <div className='md:hidden'>
                        <button onClick={toggleMenu} className='text-black focus:outline=none'>
                            {
                                isMenuOpen ? <FaXmark className='h-5 w-5 text-black' /> : <FaBarsStaggered className='h-5 w-5 text-black' />
                            }
                        </button>

                    </div>

                </div>

                {/* navItems for s device*/}
                <div className={`space-y-4 px-4 mt-16 py-7 bg-blue-700 ${isMenuOpen ? "block fixed top-0 right-0 left-0" : "hidden"}`}>
                    {navItems.map(({ Link, path }) =>

                        <a key={path} href={path} className='block text-base text-white uppercase cursor-pointer'>{Link}</a>

                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar