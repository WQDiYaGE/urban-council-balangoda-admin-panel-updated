import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase Authentication
import { auth } from "@/lib/firebase"; // Import the initialized auth
import Cookies from 'js-cookie';


const formSchema = z.object({
    email: z.string().min(1, { message: "Email cannot be empty" }),
    password: z.string().min(1, { message: "Password cannot be empty" }),
});

export const Login = () => {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            Cookies.set('userData', JSON.stringify(userCredential.user), { expires: 1 }); // expires in 1 day
            toast({
                title: "Login Successful",
                description: "Welcome back!",
            });
            // Redirect after cookies/session update
            router.push('/home');
        } catch (error) {
            toast({
                title: "Invalid Login",
                description: `Please check your email and password.`,
            });
            console.log(error)
        }
    };

    return (
        <div className='h-screen flex items-center justify-center bg-[#101863]'>
            <Card className='mx-auto w-[488px] h-fit border-0'>
                <CardHeader>
                    <div className="flex justify-center items-center py-[20px] w-full">
                        <div className="w-[107px] h-[52px]">
                            <Image src="/logo.png" width={107} height={52} alt="logo.png" />
                        </div>
                    </div>
                    <CardTitle className='flex justify-center text-[24px] font-[600] items-center'>Admin Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className='grid gap-4'>
                            <div className='grid gap-2'>
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='rounded-[10px] shadow-custom px-[20px] py-[12px] w-full'>
                                                <FormLabel className="text-[12px] font-[400] px-2">Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder='m@example.com' {...field} className="border-0" />
                                                </FormControl>
                                                <FormMessage  className="pt-2"/>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='grid gap-2'>
                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='rounded-[10px] shadow-custom px-[20px] py-[12px] w-full'>
                                                <FormLabel className="text-[12px] font-[400] px-2">Password</FormLabel>
                                                <FormControl>
                                                    <Input type='password' placeholder='*********' {...field} className="border-0" />
                                                </FormControl>
                                                <FormMessage className="pt-2"/>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="py-[40px]">
                                <Button disabled={form.formState.isSubmitting} type='submit' className='w-full bg-[#101863] rounded-[15px]'>
                                    {form.formState.isSubmitting ? <Loader2 className='size-6 animate-spin' /> : 'Login'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};
