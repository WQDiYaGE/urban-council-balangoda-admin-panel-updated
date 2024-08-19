"use client"

import { v4 } from 'uuid';
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import { formatFirestoreTimestamp} from "@/utils/functions";
import {createAnnouncement} from "@/app/(application)/(sections)/announcements";
import { useToast } from "@/components/ui/use-toast"
import {LoaderCircle} from "lucide-react";
import { Timestamp } from 'firebase/firestore';




const formSchema = z.object({
    subject: z.string().min(1, {message: "subject should not be empty"}),
    message: z.string().min(1, {message: "Message should not be empty"}),
})
export const CreateAnnouncement = () => {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject: "",
            message: "",
        }
    })

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {

        const data = {
            subject: values.subject,
            message: values.message,
            date: Timestamp.now(),
            id: v4(),
        }

        const toastData = {
            title: "The announcement has been created successfully.",
            date: formatFirestoreTimestamp(data.date),
            subject: data.subject,
            message: data.message
        }

        const toastId = toast({
            title: "Creating Announcement",
            description: <LoaderCircle className="animate-spin w-10 h-10"/>,
            duration: 2000, // Set duration to 0 to prevent auto-dismiss
        });
        try{
            const response = await createAnnouncement(data)
            toast({
                title: toastData.title,
                description: `${toastData.subject} :- ${toastData.message}`,
                duration: 5000,
            });
        }catch (error){
            console.error('Error creating announcement:', error);

            // Show error toast
            toast({
                title: "Creation Failed",
                description: "Failed to create the announcement. Please try again.",
                duration: 5000,
            });

        }
    }

    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="">
                    <div className="">
                    <FormField control={form.control} name="subject" render={({field}) => {
                        return <FormItem>
                            <div className="flex flex-col pt-5">
                                <FormLabel className="py-2">Subject</FormLabel>
                                <div className="w-full">
                                    <FormControl>
                                        <Input {...field} type="text" placeholder="Type Here" className="rounded-lg"/>
                                    </FormControl>
                                    <FormMessage/>
                                </div>
                            </div>
                        </FormItem>;
                    }}>

                    </FormField>

                        <FormField control={form.control}  name="message" render={({field}) => {
                            return <FormItem>
                                <div className="flex flex-col pt-5">
                                    <FormLabel className="py-2">Message</FormLabel>
                                    <div className="w-full">
                                        <FormControl>
                                            <Textarea {...field} placeholder="Type your message here" className="rounded-lg h-[250px]"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </div>
                                </div>
                            </FormItem>;
                        }}>

                        </FormField>
                    </div>
                    <div className="flex flex-row justify-end items-center pt-5">
                        <div className="px-[15px]"><Button className="w-[110px] h-[45px] bg-white text-black border hover:bg-amber-900" type="reset">cancel</Button></div>
                        <div><Button type="submit" className="w-[110px] h-[45px] bg-[#101863] text-white border ">Submit</Button></div>

                    </div>
                </div>
            </form>
        </Form>
    )
}