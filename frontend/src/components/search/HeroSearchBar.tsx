"use client";

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Calendar as CalendarIcon, Users, Minus, Plus } from "lucide-react"
import { Button } from "../ui/Button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover"
import { Calendar } from "../ui/Calendar"
import { useTranslation } from "../../i18n/useTranslation"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { pt, enUS } from "date-fns/locale"

export function HeroSearchBar() {
  const router = useRouter()
  const { t, locale } = useTranslation()
  
  const [location, setLocation] = React.useState("")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)
  const [adults, setAdults] = React.useState(2)
  const [children, setChildren] = React.useState(0)
  const [dateOpen, setDateOpen] = React.useState(false)
  const [guestOpen, setGuestOpen] = React.useState(false)

  const totalGuests = adults + children
  const dateLocale = locale === 'pt' ? pt : enUS

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location.trim()) params.set('query', location.trim())
    if (dateRange?.from) params.set('checkin', format(dateRange.from, 'yyyy-MM-dd'))
    if (dateRange?.to) params.set('checkout', format(dateRange.to, 'yyyy-MM-dd'))
    if (totalGuests > 0) params.set('guests', String(totalGuests))
    
    const queryString = params.toString()
    router.push(`/pesquisa${queryString ? `?${queryString}` : ''}`)
  }

  const formatDateDisplay = () => {
    if (!dateRange?.from) return t('search.addDates')
    if (!dateRange.to) return format(dateRange.from, 'dd MMM', { locale: dateLocale })
    return `${format(dateRange.from, 'dd MMM', { locale: dateLocale })} — ${format(dateRange.to, 'dd MMM', { locale: dateLocale })}`
  }

  const formatGuestDisplay = () => {
    if (totalGuests === 0) return t('search.addGuests')
    return `${totalGuests} ${totalGuests === 1 ? t('search.guest') : t('search.guestsLabel')}`
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-surface rounded-3xl md:rounded-full shadow-2xl border border-border/60 p-3 md:p-4 flex flex-col md:flex-row items-stretch gap-3 md:gap-0 backdrop-blur-md">
      
      {/* Location Input */}
      <div className="w-full md:w-[32%] flex items-center px-4 py-3 hover:bg-muted/60 rounded-2xl md:rounded-full transition-all group cursor-pointer border-b md:border-b-0 md:border-r border-border pb-4 md:pb-3 mb-2 md:mb-0">
        <MapPin className="h-6 w-6 text-primary/80 mr-4 flex-shrink-0 group-hover:text-primary transition-colors" />
        <div className="flex flex-col w-full items-start">
          <span className="text-sm font-bold text-text text-left mb-0.5">{t('search.location')}</span>
          <input 
            type="text" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t('search.locationPlaceholder')}
            className="w-full bg-transparent outline-none text-base text-text placeholder:text-muted-foreground font-medium truncate"
          />
        </div>
      </div>

      {/* Date Picker (Check-in / Check-out) */}
      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild>
          <div className="w-full md:w-[32%] flex items-center px-4 py-3 hover:bg-muted/60 rounded-2xl md:rounded-full transition-all group cursor-pointer border-b md:border-b-0 md:border-r border-border pb-4 md:pb-3 mb-2 md:mb-0">
            <CalendarIcon className="h-6 w-6 text-primary/80 mr-4 flex-shrink-0 group-hover:text-primary transition-colors" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold text-text text-left mb-0.5">{t('search.dates')}</span>
              <span className={`text-base ${dateRange?.from ? 'text-text font-semibold' : 'text-muted-foreground font-medium'}`}>
                {formatDateDisplay()}
              </span>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(range) => {
              setDateRange(range)
              if (range?.from && range?.to) {
                setTimeout(() => setDateOpen(false), 300)
              }
            }}
            numberOfMonths={2}
            disabled={{ before: new Date() }}
            locale={dateLocale}
          />
        </PopoverContent>
      </Popover>

      {/* Guests Selector */}
      <Popover open={guestOpen} onOpenChange={setGuestOpen}>
        <PopoverTrigger asChild>
          <div className="w-full md:w-[26%] flex items-center justify-between px-4 py-3 hover:bg-muted/60 rounded-2xl md:rounded-full transition-all group cursor-pointer">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-primary/80 mr-4 flex-shrink-0 group-hover:text-primary transition-colors" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold text-text text-left mb-0.5">{t('search.guests')}</span>
                <span className={`text-base ${totalGuests > 0 ? 'text-text font-semibold' : 'text-muted-foreground font-medium'}`}>
                  {formatGuestDisplay()}
                </span>
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="end">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-bold leading-none">{t('search.config')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('search.configDesc')}
              </p>
            </div>
            <div className="grid gap-4">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">{t('search.adults')}</span>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 rounded-full border-border hover:bg-muted"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-6 text-center text-base font-bold">{adults}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 rounded-full border-border hover:bg-muted"
                    onClick={() => setAdults(Math.min(10, adults + 1))}
                    disabled={adults >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Children */}
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">{t('search.children')}</span>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 rounded-full border-border hover:bg-muted"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    disabled={children <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-6 text-center text-base font-bold">{children}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 rounded-full border-border hover:bg-muted"
                    onClick={() => setChildren(Math.min(6, children + 1))}
                    disabled={children >= 6}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Search Button */}
      <Button 
        onClick={handleSearch}
        size="lg" 
        className="w-full md:w-auto rounded-2xl md:rounded-full px-8 md:ml-2 h-14 md:h-16 text-lg font-bold shadow-xl hover:shadow-2xl transition-all bg-primary hover:bg-primary/90 text-white"
      >
        <Search className="mr-3 h-6 w-6" />
        {t('search.button')}
      </Button>

    </div>
  )
}
