import { NavLink } from 'react-router'


interface NavLinkType {
  name: string
  path: string
}

const navLinks: NavLinkType[] = [
  { name: 'About', path: '/' },
  { name: 'Menu', path: '/' },
  { name: 'Add Item', path: '/' },
  { name: 'Cart', path: '/' }
]

export const Navbar = () => {
  return (
    <header className='fixed w-full px-8 shadow-sm shadow-neutral-500 h-[--navbar-height] flex items-center'>
    <nav className='flex justify-between items-center w-full'>
        <NavLink to='/' className='font-bold'>
            NavigationBar
        </NavLink>
        <ul className='flex items-center gap-8'>
            {navLinks.map((link) => (
                <li key={link.name}>
                    <NavLink to={link.path} className='text-secondary'>
                {link.name}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
</header>
  )
}
