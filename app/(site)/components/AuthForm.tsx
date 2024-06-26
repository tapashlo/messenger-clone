"use client"

import {useCallback, useEffect, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/app/components/input/Input";
import Router from "next/navigation";
import { Button } from "@/app/components/Button";

import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";

import {signIn, useSession} from "next-auth/react"
import { useRouter } from "next/navigation";
type Variant = "LOGIN" | "REGISTER";

function AuthForm() {

    const session = useSession();
    const router = useRouter(); 


    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isloading, setIsLoading] = useState<boolean>(false)

    useEffect(()=>{
        if(session?.status === "authenticated"){
            console.log('Authenticated')
            router.push('/users')
        }

    },[session?.status, router])


    const toggleVariant = useCallback(() =>{
        if(variant === "LOGIN"){
            setVariant("REGISTER")
        }else{
            setVariant("LOGIN")
        }

    },[variant]);

    const {
        register, 
        handleSubmit,
        formState:{
            errors
        }

    } = useForm<FieldValues>({
        defaultValues:{
            name: "",
            email: "",
            password: ""
        }
    });


    const onSubmit: SubmitHandler<FieldValues> = (data) =>{
        setIsLoading(true);

        if (variant === "REGISTER"){
            axios.post("/api/register", data)
            .then(()=>signIn('credentials',data))

            .catch(()=>toast.error("Something went wrong. Try again later"))
            .finally(()=>setIsLoading(false));
                
            
        }if(variant === "LOGIN"){

            signIn('credentials',{...data, redirect: false})

            .then((callback)=>{
                if (callback?.error){
                    toast.error('Invalid credentials');
                    
                }

                if(callback?.ok && !callback?.error){
                    toast.success('Logged in');
                    router.push('/users');
                }

            })

            .finally(()=>setIsLoading(false))
            // axios login


        }
    }

    const socialAction = (action:string) =>{
        setIsLoading(true);

        signIn(action,{redirect:false})
        .then((callback)=>{
            if(callback?.error){
                toast.error('Invalid credentials');
            }
            if(callback?.ok && !callback?.error){
                toast.success('Logged in');
            }
        })

        .finally(()=>setIsLoading(false));

        //NEXT AUTH SOCIAL SIGN ON
    }


  return (
    <div className="
    mt-8
    sm:mx-auto
    sm:w-full
    sm:max-w-md
    ">

        <div className="
            bg-white
            px-4
            py-8
            shadow
            sm:rounded-lg
            sm:px-10  
        
        ">
            <form className="space-y-6"
                onSubmit={handleSubmit(onSubmit)}
                >
                    {variant === "REGISTER" && (
                        
                  
                        <Input label="Name" register={register} id="name" errors={errors} disabled={isloading}/>
                    
                    )}

                    <Input label="Email Address" register={register} id="email" type="email" errors={errors} disabled={isloading} />
                    <Input label="Password" register={register} id="password" type="password" errors={errors} disabled={isloading}/>

                    <div>
                        <Button 
                            disabled={isloading}
                            fullWidth
                            type="submit"
                            >
                            {variant === "LOGIN" ? "Sign in" : "Register"}

                        </Button>
                    </div>

            </form>

            <div 
                className="mt-6">
                    <div className="relative">
                        <div className="
                                absolute
                                inset-0
                                flex
                                items-center

                                ">
                                    <div className="w-full border-t border-gray-300"/>



                        </div>

                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                                Or Continue With
                            </span>

                        </div>

                    </div>


                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={() => socialAction("github")}
                             />


                        <AuthSocialButton
                            icon={BsGoogle}
                            onClick={() => socialAction("google")}
                             />     

                    </div>

                    <div className="
                    
                    flex
                    gap-2
                    justify-center
                    text-sm
                    mt-6
                    px-2
                    text-gray-500
                    ">
                        <div>
                            {variant === "LOGIN" ? "New to Messenger?" : "Already have an account?"}
                        </div>

                        <div
                            onClick={toggleVariant}
                            className="
                            underline
                            cursor-pointer
                            "
                        >
                            {variant === "LOGIN" ? "Create an account" : "Login"}
                        </div>

                    </div>

                </div>
            
        </div>
    </div>
  )
}

export default AuthForm