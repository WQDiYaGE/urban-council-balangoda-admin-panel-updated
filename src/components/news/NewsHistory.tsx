"use client";

import React, { useEffect, useState } from "react";
import {LoaderCircle, Pencil, PencilOff} from "lucide-react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { formatFirestoreTimestamp } from "@/utils/functions";
import {deleteNews, getAllNews, updateNews} from "@/app/(application)/(sections)/news";
import {
    Dialog,
    DialogContent, DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {useToast} from "@/components/ui/use-toast";
import {Input} from "@/components/ui/input";
import {News} from "@/types";
import {convertDate} from "@/components/news/index";
import {Toggle} from "@/components/ui/toggle";


const formSchema = z.object({
    description: z.string(),
    id: z.string(),
    imageUrls: z.array(z.string()),
});

export const NewsHistory = () => {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [text, setText] = useState("Initial value");
    const [newsId, setNewsId] = useState<string | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [showImages, setShowImages] = useState<boolean>(false);
    const [selectedNewsTitle, setSelectedNewsTitle] = useState<string>("");
    const [processing, setProcessing] = useState<boolean | undefined>(false)
    const [location, setLocation] = useState("")
    const [edit, setEdit] = useState<boolean | undefined>(false)

    const changeEditState = () => {
        setEdit(!edit)
    }

    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            description: "",
            imageUrls: [],
        },
    });

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const data = await getAllNews();
                setNews(data.data);
            } catch (error) {
                console.error('Error fetching news:', error);
                setError('Failed to fetch news');
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        setProcessing(true)
        if (newsId) {
            try{
                data.id = newsId;
                data.description = text;
                updateNews(data);
                console.log({ data });
                toast({
                    title: "Success",
                    description: "Successfully updated. :-" + data.description,
                    duration: 3000,
                });

                setProcessing(false)

            }catch (error){

            }

        }
    };


    const handleDelete = async (id: string | null) => {
        try{
            setProcessing(true)
            await deleteNews(id)
            toast({
                title: "News Deleted Successfully",
                description: "SUCCESS..... please refresh the page",
                duration: 3000,
            });
            setProcessing(false)

        }catch (error){
            toast({
                title: "Failed",
                description: "Please Try Again Later. :-" + error,
                duration: 3000,
            });
            console.log(error)
            setProcessing(false)
        }

    }

    return (
        <div className="w-full h-screen">
            {loading ? (
                <div className="flex flex-col justify-center items-center h-1/2 w-full">
                    <div className="p-5">Loading Table Data...</div>
                    <div><LoaderCircle className="animate-spin"/></div>
                </div>
            ) : error ? (
                <div className="flex justify-center w-full h-full">{error}</div>
            ) : (
                <Table aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn
                            className="text-left px-5 w-1/5 border border-[#607D8B] bg-[#CFD8DC]">Date</TableColumn>
                        <TableColumn className="text-left px-5 border border-[#607D8B] bg-[#CFD8DC]">Title</TableColumn>
                        <TableColumn
                            className="text-left px-5 border border-[#607D8B] bg-[#CFD8DC]">Description</TableColumn>
                        {/*<TableColumn*/}
                        {/*    className="text-left px-5 border border-[#607D8B] bg-[#CFD8DC]">Location</TableColumn>*/}
                        <TableColumn
                            className="text-left px-5 border border-[#607D8B] bg-[#CFD8DC]">Actions</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No rows to display."}>
                        {news.map((newsItem) => (
                            <TableRow key={newsItem.id} className="border border-[#607D8B]">
                                <TableCell className="py-5">
                                    {formatFirestoreTimestamp({
                                        seconds: newsItem.date.seconds,
                                        nanoseconds: newsItem.date.nanoseconds
                                    })}
                                </TableCell>
                                <TableCell className="py-5 border border-[#607D8B]">{newsItem.title}</TableCell>
                                <TableCell className="py-5 border border-[#607D8B]">{newsItem.description}</TableCell>
                                {/*<TableCell className="py-5 border border-[#607D8B]">{newsItem.location}</TableCell>*/}
                                <TableCell className="py-5 border border-[#607D8B]">
                                    <Button
                                        variant="outline"
                                        className="bg-0 border-0"
                                        onClick={() => {
                                            setText(newsItem.description);
                                            setNewsId(newsItem.id);
                                            setImageUrls(newsItem.imageUrls);
                                            setSelectedNewsTitle(newsItem.title);
                                            setLocation(newsItem.location)
                                        }}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* News Detail Dialog */}
            <Dialog open={newsId !== null} onOpenChange={() => setNewsId(null)}>
                <DialogContent className="sm:max-w-[425px] h-fit">
                    <DialogHeader>
                        <DialogTitle className="flex justify-center">{selectedNewsTitle}</DialogTitle>
                    </DialogHeader>
                    <Toggle onClick={changeEditState} className="border">{edit === true ? <Pencil className="w-[30px] h-[30px] px-2"/> : <PencilOff className="w-[30px] h-[30px] px-2"/>} edit</Toggle>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <div className="">
                                <div className="py-2">Date
                                    Posted : </div>
                                <div><Input type="text" disabled={!edit} value={newsId ? convertDate(news.find(item => item.id === newsId)?.date!) : ""}/></div>
                                <div className="py-2">
                                    <div>Location: </div>
                                    <Textarea disabled={!edit} value={location}/>
                                </div>
                            </div>
                            <FormField name="description" render={({field}) => (
                                <FormItem>
                                    <div>
                                        <FormLabel className="py-2">Description</FormLabel>
                                        <FormControl>
                                            <div className="pt-2">
                                                <Textarea {...field}
                                                    disabled={!edit}
                                                      value={text}
                                                           onChange={(e) => setText(e.target.value)}/>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </div>
                                </FormItem>
                            )}/>
                            <div className="py-5 w-full flex gap-8 flex-row justify-end">
                                <div>

                                    <Dialog>
                                        <DialogTrigger className="bg-red-600 py-2 px-5 rounded-lg border hover:bg-red-800">Delete</DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                <DialogDescription>
                                                    This will Delete the Record Permanently
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button disabled={processing} onClick={() => handleDelete(newsId)}>yes</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                </div>
                                <div>
                                    <Button type="submit" className="w-fit" disabled={processing}>Save changes</Button>
                                    <Button type="button" className="w-fit ml-2" onClick={() => setShowImages(true)}>View
                                    Images</Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Images Dialog */}
            <Dialog open={showImages} onOpenChange={() => setShowImages(false)}>
                <DialogContent>
                    <div className="grid grid-cols-2 gap-4">
                        {imageUrls.map((url, index) => (
                            <a href={url} target="_blank" rel="noopener noreferrer" key={index}>
                                <img src={url} alt={`Image ${index + 1}`} className="w-full h-auto object-cover"/>
                            </a>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// {newsId ? news.find(item => item.id === newsId)?.location.split(",").filter((line) => line.trim() !== "").map((line, index) => (
//     <div className="py-1" key={index}>{line}