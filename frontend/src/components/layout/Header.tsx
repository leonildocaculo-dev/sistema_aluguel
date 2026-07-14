import * as React from "react"
import { Link } from "react-router-dom"
import { Menu, User, Globe, ChevronDown } from "lucide-react"
import { Button } from "../ui/Button"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="container mx-auto max-w-[var(--container-width)] flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tighter text-primary">
            Angola<span className="text-secondary">Stay</span>
          </span>
        </Link>

        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="text-muted-foreground gap-2">
            <Globe className="h-4 w-4" />
            <span>PT - AOA</span>
            <ChevronDown className="h-3 w-3" />
          </Button>

          <Button variant="outline" className="gap-2">
            <User className="h-4 w-4" />
            <span>Fazer login</span>
          </Button>

          <Button variant="ghost" className="gap-2" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

      </div>
    </header>
  )
}
