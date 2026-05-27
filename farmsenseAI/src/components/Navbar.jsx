import { NavLink } from 'react-router-dom'
import { Sprout, MessageCircle, CloudSun, FileText } from 'lucide-react'

const links = [
  { to: '/',        label: 'Disease Scan', icon: Sprout },
  { to: '/chat',    label: 'AI Chatbot',   icon: MessageCircle },
  { to: '/weather', label: 'Weather',      icon: CloudSun },
  { to: '/schemes', label: 'Schemes',      icon: FileText },
]

export default function Navbar() {
  return (
    <>
      {/* Top bar */}
      <header className="bg-farm-dark text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌾</span>
            <div>
              <span className="font-bold text-lg leading-none">FarmSense AI</span>
              <p className="text-farm-leaf text-xs leading-none mt-0.5">SDG Goal 2 · Zero Hunger</p>
            </div>
          </div>
        </div>

        {/* Nav tabs */}
        <nav className="bg-farm-mid">
          <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap
                   border-b-2 transition-colors duration-150
                   ${isActive
                     ? 'border-farm-amber text-farm-amber'
                     : 'border-transparent text-green-200 hover:text-white'
                   }`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
    </>
  )
}
