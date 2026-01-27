import { NavLink } from 'react-router-dom'

interface NavItem {
  name: string
  path: string
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/home' },
  { name: 'Menu', path: '/menu' },
  { name: 'Orders', path: '/orders' },
  { name: 'Reports', path: '/reports' },
]

export const Navbar = () => {
  return (
    <header className="w-full bg-primary text-white shadow-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <NavLink
          to="/"
          className="text-xl font-bold tracking-wide"
        >
          Gourmet2Go
        </NavLink>

        <ul className="flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `transition-colors hover:text-blue-200 ${
                    isActive ? 'font-semibold underline' : ''
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
