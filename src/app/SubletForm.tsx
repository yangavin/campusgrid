import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Inputs = {
  address: string,
  price: number,
  bedsSubleased: string,
  totalBeds: string,
  baths: string,
  availableDate: Date,
  description: string,
  contact: string,
};

export default function SubletForm(){
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        <div>
            <Label>Address*</Label>
            <Input defaultValue="test" {...register("address", {required: true})}/>
            {errors.address && <span className="text-red-400">This field is required</span>}
        </div>
        
        <div>
            <Label>Price*</Label>
            <Input {...register("price", { required: true })} />
            {errors.price && <span className="text-red-400">This field is required</span>}
        </div>

        <Button type="submit">Submit</Button>
        </form>
    )
}