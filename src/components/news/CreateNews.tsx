"use client";

import { v4 } from 'uuid';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Timestamp } from 'firebase/firestore';
import { createNews } from "@/app/(application)/(sections)/news";
import { uploadImages } from "@/utils/functions";
import { useState } from "react"; // Adjust path as necessary

const formSchema = z.object({
    title: z.string().min(1, { message: "Title should not be empty" }),
    description: z.string().min(1, { message: "Description should not be empty" }),
    location: z.string().min(1, { message: "Location should not be empty" }),
    images: z.array(z.instanceof(File)).optional(), // Optional images field
});

export const CreateNews = () => {
    const { toast } = useToast();

    const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
    const [isUploading, setIsUploading] = useState<boolean | undefined>(false)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedImages(event.target.files);
        }
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            location: "",
            images: [] // Initialize images field
        }
    });

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsUploading(true)
        const data = {
            title: values.title,
            description: values.description,
            location: values.location,
            date: Timestamp.now(),
            id: v4(),
            imageUrls: [] // Initialize imageUrls
        };

        try {
            let imageUrls: string[] = [];
            if (selectedImages && selectedImages.length > 0) {
                imageUrls = await uploadImages(selectedImages);
            }

            const response = await createNews({ ...data, imageUrls });
            toast({
                title: "The News has been created successfully.",
                description: `${data.location} -> ${data.title} :- ${data.description}`,
                duration: 5000,
            });
            setIsUploading(false)
        } catch (error) {
            console.error('Error creating News:', error);
            toast({
                title: "Creation Failed",
                description: "Failed to create the News. Please try again.",
                duration: 5000,
            });
            setIsUploading(false)
        }
    };

    const clearFields = () => {
        form.reset();
        setSelectedImages(null); // Clear selected images
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col pt-5">
                                    <FormLabel className="py-2">Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" placeholder="Type Here" className="rounded-lg" />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col pt-5">
                                    <FormLabel className="py-2">Location</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" placeholder="Type Here" className="rounded-lg" />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col pt-5">
                                    <FormLabel className="py-2">Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Type your message here" className="rounded-lg h-[200px]" />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col pt-5">
                                    <FormLabel className="py-2">Images</FormLabel>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="rounded-lg"
                                    />
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-row justify-between items-center">
                        <div className="pt-5">
                            {/* Image upload dialog */}
                        </div>
                        <div className="flex flex-row justify-end items-center pt-5">
                            <div className="px-[15px]">
                                <Button
                                    type="reset"
                                    className="w-[110px] h-[45px] bg-white text-black border hover:bg-amber-900"
                                    onClick={clearFields}
                                >
                                    Cancel
                                </Button>
                            </div>
                            <div>
                                <Button
                                    type="submit"
                                    className={`w-[110px] h-[45px] ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#101863]'} text-white border`}
                                    disabled={isUploading}
                                >
                                    {isUploading ? 'Uploading...' : 'Submit'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
};
