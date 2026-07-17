import * as React from "react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarLayoutProps {
  menuItems: MenuItem[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function SidebarLayout({
  menuItems,
  activeTab,
  setActiveTab,
  children,
  title,
  subtitle,
}: SidebarLayoutProps) {
  return (
    <div className="container mx-auto max-w-[var(--container-width)] py-8 px-4 flex flex-col md:flex-row gap-8 min-h-[80vh]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-surface border border-border rounded-2xl p-4 sticky top-24 shadow-sm backdrop-blur-md">
          {title && <h2 className="text-xl font-bold text-text mb-1 px-4">{title}</h2>}
          {subtitle && <p className="text-xs text-muted-foreground mb-6 px-4">{subtitle}</p>}
          
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium w-full text-left
                    ${isActive 
                      ? 'bg-primary-50 border border-primary-200 text-primary-900 shadow-sm translate-x-1 font-bold' 
                      : 'text-muted-foreground hover:text-text hover:bg-muted'
                    }`}
                >
                  <span className={`${isActive ? 'text-primary-600' : 'text-muted-foreground'}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
