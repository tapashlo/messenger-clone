"use client"

import {useCallback, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/app/components/input/Input";

import { Button } from "@/app/components/Button";

import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";

type Variant = "LOGIN" | "REGISTER";

function AuthForm() {

    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isloading, setIsLoading] = useState<boolean>(false)


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


            // register
        }else{
            axios .post("/api/login", data)
            // login
        }
    }

    const socialAction = (action:string) =>{
        setIsLoading(true);

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