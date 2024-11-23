import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';

const bedOptions = [1, 2, 3, 4, 5, 6, 7];
const sourceOptions = [
  'accommodation',
  'axon',
  'amberpeak',
  'frontenac',
  'kijiji',
];

interface AppSidebarProps {
  beds: number[];
  maxPrice: number | null;
  source: string[];
  setBeds: (beds: number[]) => void;
  setMaxPrice: (maxPrice: number | null) => void;
  setSource: (source: string[]) => void;
}

export default function AppSidebar({
  beds,
  maxPrice,
  source,
  setBeds,
  setMaxPrice,
  setSource,
}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Filters</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-6">
            {/* Beds Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Beds</label>
              <ToggleGroup
                type="multiple"
                variant={'outline'}
                className="flex flex-wrap gap-2"
                value={beds.map(String)}
                onValueChange={(values) => {
                  setBeds(values.map(Number));
                }}
              >
                {bedOptions.map((bed) => (
                  <ToggleGroupItem
                    key={bed}
                    value={bed.toString()}
                    className="rounded-md px-3 py-2"
                  >
                    {bed}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Max Price Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Price</label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Enter maximum price"
                  className="pl-8"
                  value={maxPrice || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setMaxPrice(value ? Number(value) : null);
                  }}
                />
              </div>
            </div>

            {/* Source Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Source</label>
              <div className="flex flex-col space-y-2">
                {sourceOptions.map((sourceOption) => (
                  <div
                    key={sourceOption}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={sourceOption}
                      checked={source.includes(sourceOption)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSource([...source, sourceOption]);
                        } else {
                          setSource(source.filter((s) => s !== sourceOption));
                        }
                      }}
                    />
                    <label
                      htmlFor={sourceOption}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {sourceOption}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
