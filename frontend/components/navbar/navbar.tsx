import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
}

const navigation: NavigationItem[] = [
    { name: 'Play', href: '/play', current: true },
    { name: 'Profile', href: '/profile', current: false },
    { name: 'Chat', href: '/chat', current: false },
    { name: 'Logout', href: '/logout', current: false },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
    return (
        <nav className="flex bg-sky-600 px-6 h-20 items-center">
            <div className="flex flex-1 items-center items-stretch justify-start">
                
                <div className="flex flex-wrap content-center">
                    <Image src={'./assets/default_avatar.svg'} width={30} height={30} alt="Avatar" />
                    <p className="text-2xl content-center ml-5 mr-5">CustomName</p>
                </div>
                
                <div className="block">
                    <div className="flex space-x-4">
                        {navigation.map((item) => (
                            <Link key={item.name} href={item.href} aria-current={item.current ? 'page' : undefined}>
                                <a className={classNames(
                                    item.current ? ' text-purple' : 'hover:text-purple',
                                    'px-3 py-4 text-15px font-medium space-links'
                                )}>
                                    {item.name}
                                </a>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
