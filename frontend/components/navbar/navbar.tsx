import Link from 'next/link';
import React from 'react';

// https://colinhacks.com/essays/building-a-spa-with-nextjs

interface NavigationItem {
    name: string;
    href: string;
	current: boolean;
}

const navigation: NavigationItem[] = [
    { name: 'Play', href: '', current: true },
    { name: 'Profile', href: '', current: false },
    { name: 'Chat', href: '', current: false },
    { name: 'Logout', href: '', current: false },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Navbar = () => {

    return (
        <nav className="flex bg-sky-600 px-6 h-20 items-center">
			<div className="flex flex-1 items-center items-stretch justify-start">

                        {/* LOGO + NAME */}

                            <div className="flex flex-wrap content-center">
                                <img
                                    src={'./assets/default_avatar.svg'}
							
									width="30"
									height="30"
                                    alt="Avatar"
                                />
								<p className="text-2xl content-center ml-5 mr-5">CustomName</p>
                            </div>

                        {/* LINKS */}

                            <div className="block">
                                <div className="flex space-x-4">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={classNames(
                                                item.current ? ' text-purple' : 'hover:text-purple',
                                                'px-3 py-4 text-15px font-medium space-links'
                                            )}
                                            aria-current={item.href ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

			</div>
        </nav>
    )
}

export default Navbar;