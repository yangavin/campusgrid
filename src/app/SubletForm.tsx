import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Inputs = {
  address: string;
  price: number;
  bedsSubleased: string;
  totalBeds: string;
  baths: string;
  availableDate: Date | undefined;
  endDate: Date | undefined;
  description: string;
  contact: string;
  photos: FileList;
};

export default function SubletForm() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);
  
  const [date, setDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate || undefined);
    setValue("availableDate", selectedDate || undefined, { shouldValidate: true });
  };

  const handleEndDateSelect = (selectedEndDate: Date | undefined) => {
    setEndDate(selectedEndDate || undefined);
    setValue("endDate", selectedEndDate || undefined);
  };

  return (
    <div className="max-h-[600px] overflow-y-auto p-4 border rounded-md">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <Label>Address</Label>
          <Input {...register("address", { required: true })} />
          {errors.address && <span className="text-red-400">This field is required</span>}
        </div>

        <div>
          <Label>Price/mo.</Label>
          <Input type="number" {...register("price", { required: true })} />
          {errors.price && <span className="text-red-400">This field is required</span>}
        </div>

        <div>
          <Label>Beds Subleased</Label>
          <Input {...register("bedsSubleased", { required: true })} />
          {errors.bedsSubleased && <span className="text-red-400">This field is required</span>}
        </div>

        <div>
          <Label>Total Beds</Label>
          <Input {...register("totalBeds", { required: true })} />
          {errors.totalBeds && <span className="text-red-400">This field is required</span>}
        </div>

        <div>
          <Label>Baths</Label>
          <Input {...register("baths", { required: true })} />
          {errors.baths && <span className="text-red-400">This field is required</span>}
        </div>

        <div>
          <Label>Available Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
            </PopoverContent>
          </Popover>
          {errors.availableDate && <span className="text-red-400">This field is required</span>}
        </div>

        {/* End Date Input */}
        <div>
          <Label>End Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={endDate} onSelect={handleEndDateSelect} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>House Photos</Label>
          <Input type="file" accept="image/jpeg, image/jpg, image/png, image/heic, image/webp" multiple {...register("photos")} />
          {errors.photos && <span className="text-red-400">This field is required</span>}
        </div>

        <div>
          <Label>Description</Label>
          <Textarea {...register("description", { required: true })} placeholder="Describe your sublet..."/>
          {errors.description && <span className="text-red-400">This field is required</span>}
        </div>

        <div>
          <Label>Contact</Label>
          <Input {...register("contact", { required: true })} />
          {errors.contact && <span className="text-red-400">This field is required</span>}
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}