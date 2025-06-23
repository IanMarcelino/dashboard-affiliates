'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'

interface DateFilterProps {
  selectedRange: 'week' | 'month' | 'custom'
  onRangeChange: (range: 'week' | 'month' | 'custom') => void
  customRange?: DateRange
  onCustomRangeChange: (range: DateRange | undefined) => void
}

export function DateFilter({
  selectedRange,
  onRangeChange,
  customRange,
  onCustomRangeChange
}: DateFilterProps) {
  return (
    <Card className="mb-6 border-0 shadow-sm bg-white">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedRange === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRangeChange('week')}
              className={cn(
                "transition-all duration-200",
                selectedRange === 'week'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              )}
            >
              Last 7 Days
            </Button>
            <Button
              variant={selectedRange === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRangeChange('month')}
              className={cn(
                "transition-all duration-200",
                selectedRange === 'month'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              )}
            >
              Last 30 Days
            </Button>
            <Button
              variant={selectedRange === 'custom' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRangeChange('custom')}
              className={cn(
                "transition-all duration-200",
                selectedRange === 'custom'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              )}
            >
              Custom Range
            </Button>

          </div>

          {selectedRange === 'custom' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "justify-start text-left font-normal border-gray-200 hover:bg-gray-50",
                    !customRange && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customRange?.from ? (
                    customRange.to ? (
                      <>
                        {format(customRange.from, "LLL dd, y")} -{" "}
                        {format(customRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(customRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={customRange?.from}
                  selected={customRange}
                  onSelect={onCustomRangeChange}
                  numberOfMonths={2}
                  className="bg-white"
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardContent>
    </Card>

  )
}