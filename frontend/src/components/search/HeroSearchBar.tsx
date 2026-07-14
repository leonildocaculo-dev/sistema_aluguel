import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Search, MapPin, Calendar as CalendarIcon, Users } from "lucide-react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover"
import { Calendar } from "../ui/Calendar"
import { cn } from "../../lib/utils"

export function HeroSearchBar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const navigate = useNavigate()

  const handleSearch = () => {
    navigate("/pesquisa")
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-surface rounded-2xl md:rounded-full shadow-lg border border-border p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 md:gap-0">
      
      {/* Location Input */}
      <div className="w-full md:w-1/3 flex items-center px-4 py-2 hover:bg-muted/50 rounded-full transition-colors group cursor-pointer border-b md:border-b-0 md:border-r border-border pb-4 md:pb-2 mb-2 md:mb-0 relative">
        <MapPin className="h-5 w-5 text-muted-foreground mr-3 group-hover:text-primary transition-colors" />
        <div className="flex flex-col w-full">
          <span className="text-xs font-semibold text-text">Localização</span>
          <input 
            type="text" 
            placeholder="Para onde vai?" 
            className="w-full bg-transparent outline-none text-sm text-text placeholder:text-muted-foreground truncate"
          />
        </div>
      </div>

      {/* Date Picker (Check-in / Check-out) */}
      <Popover>
        <PopoverTrigger asChild>
          <div className="w-full md:w-1/3 flex items-center px-4 py-2 hover:bg-muted/50 rounded-full transition-colors group cursor-pointer border-b md:border-b-0 md:border-r border-border pb-4 md:pb-2 mb-2 md:mb-0">
            <CalendarIcon className="h-5 w-5 text-muted-foreground mr-3 group-hover:text-primary transition-colors" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-text">Datas</span>
              <span className="text-sm text-muted-foreground">
                Adicionar datas
              </span>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Guests Selector */}
      <Popover>
        <PopoverTrigger asChild>
          <div className="w-full md:w-1/3 flex items-center justify-between px-4 py-2 hover:bg-muted/50 rounded-full transition-colors group cursor-pointer">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-3 group-hover:text-primary transition-colors" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-text">Hóspedes</span>
                <span className="text-sm text-muted-foreground">Adicionar hóspedes</span>
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="end">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Configuração</h4>
              <p className="text-sm text-muted-foreground">
                Selecione o número de hóspedes e quartos.
              </p>
            </div>
            {/* Dummy counters for MVP visual setup */}
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Adultos</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">-</Button>
                  <span className="w-4 text-center text-sm">2</span>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">+</Button>
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
        className="w-full md:w-auto rounded-xl md:rounded-full px-8 md:ml-2 h-14 md:h-12 text-base shadow-md hover:shadow-lg transition-all"
      >
        <Search className="mr-2 h-5 w-5" />
        Pesquisar
      </Button>

    </div>
  )
}
