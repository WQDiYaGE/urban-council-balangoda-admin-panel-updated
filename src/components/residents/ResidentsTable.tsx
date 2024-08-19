"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {getAllResidents, updateResident} from "@/app/(application)/(sections)/residents";
import React, { useEffect, useState } from "react";
import {Loader2, LoaderCircle, Pencil, PencilOff} from "lucide-react";
import * as z from 'zod'

import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {Button} from '@/components/ui/button'
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Toggle } from "@/components/ui/toggle"
import {formatFirestoreTimestamp} from "@/utils/functions";
import {useToast} from "@/components/ui/use-toast";
import {createAnnouncement} from "@/app/(application)/(sections)/announcements";

type Resident = {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string
};


const formSchema = z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    phone: z.string(),
})

interface ResidentsTableProps {
    searchQuery: string;
}

export const ResidentsTable: React.FC<ResidentsTableProps> = ({ searchQuery }) => {

    const { toast } = useToast()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            first_name: "",
            last_name: "",
            email: "",
            phone: ""
        }
    })

    const [residents, setResidents] = useState<Resident[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [edit, setEdit] = useState<Boolean>(false)

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [residentId, setResidentId] = useState("")


    // Filter the residents based on the search query
    const filteredResidents = residents.filter(resident =>
        resident.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resident.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resident.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resident.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );



    useEffect(() => {
        const fetchResidents = async () => {
            try {
                setLoading(true);
                const data = await getAllResidents();
                setResidents(data.data);
            } catch (error) {
                console.error('Error fetching residents:', error);
                setError('Failed to fetch residents');
            } finally {
                setLoading(false);
            }
        };

        fetchResidents()
    }, []);

    const handleSubmit = async () => {
        const data = {
            id: residentId,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone
        }

        const toastId = toast({
            title: "Updating Resident Details",
            description: <LoaderCircle className="animate-spin w-10 h-10"/>,
            duration: 2000, // Set duration to 0 to prevent auto-dismiss
        });
        try{
            const response = await updateResident(data)
            console.log(response)
            toast({
                title: "Update Successful" ,
                duration: 5000,
            });
        }catch (error){
            console.error('Error creating announcement:', error);

            // Show error toast
            toast({
                title: "Update Failed",
                description: "Failed to Update Resident. Please try again.",
                duration: 5000,
            });

        }


        console.log({data})
    }

    const changeEditState = () => {
        setEdit(!edit)
    }

    return (
        <div>
            {loading ? <div className="flex justify-center"><LoaderCircle className="animate-spin"/></div> :
                error ? <div className="flex justify-center">{error}</div> :
                    <Table className="rounded-t-3xl">
                        <TableHeader className="">
                            <TableRow>
                                <TableHead className="rounded-tl-xl">First Name</TableHead>
                                <TableHead>Last Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead className="text-right rounded-tr-xl"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredResidents.map((resident) => (
                                <TableRow key={resident.id}>
                                    <TableCell>{resident.first_name}</TableCell>
                                    <TableCell>{resident.last_name}</TableCell>
                                    <TableCell>{resident.email}</TableCell>
                                    <TableCell>{resident.phone}</TableCell>

                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" onClick={() => {
                                                    setResidentId(resident.id)
                                                    setFirstName(resident.first_name)
                                                    setLastName(resident.last_name)
                                                    setEmail(resident.email)
                                                    setPhone(resident.phone)
                                                }}>Details</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle className="flex justify-center items-center">Resident Profile</DialogTitle>
                                                    <DialogDescription className="flex justify-center items-center">
                                                        tap on Edit Button to Edit the Profile
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <Toggle onClick={changeEditState} className="border">{edit === true ? <Pencil className="w-[30px] h-[30px] px-2"/> : <PencilOff className="w-[30px] h-[30px] px-2"/>} edit</Toggle>

                                                <Form {...form}>
                                                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                                                        <FormField name="first_name" render={({ field }) => {
                                                            return <FormItem>
                                                                <FormLabel>First Name</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} disabled={!edit} type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        }} >
                                                        </FormField>

                                                        <FormField name="last_name" render={({ field }) => {
                                                            return <FormItem>
                                                                <FormLabel>Last Name</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} disabled={!edit} type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        }} >
                                                        </FormField>

                                                        <FormField name="email" render={({ field }) => {
                                                            return <FormItem>
                                                                <FormLabel>Email</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} disabled={!edit} type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        }} >
                                                        </FormField>

                                                        <FormField name="phone" render={({ field }) => {
                                                            return <FormItem>
                                                                <FormLabel>Mobile Number</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} disabled={!edit} type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        }} >
                                                        </FormField>

                                                        <div className="py-5 flex justify-end items-center"><Button disabled={form.formState.isSubmitting} type='submit'>
                                                            {form.formState.isSubmitting ? <Loader2 className='size-6 animate-spin'/> : 'Save Changes'}</Button></div>
                                                    </form>
                                                </Form>

                                                <DialogFooter>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
            }
        </div>
    );
};