"use client";
import React, { useCallback, useState } from "react";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import useRegisterModal from "@/hooks/useRegisterModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Button from "../Button";
import { AiFillApple, AiFillGithub } from "react-icons/ai";
import useLoginModal from "@/hooks/useLoginModal";
const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/register", data)
      .then(() => {
      
        loginModal.onOpen();
        registerModal.onClose();
      })
      .catch((error) => {
        console.log(error);


      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const toogle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [loginModal, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Bienvenido" subTitle="Crea tu cuenta!" />

      <Input
        id="email"
        label="Email"
        type="email"
        disabled={isLoading}
        errors={errors}
        register={register}
        required
      />

      <Input
        id="name"
        label="Nombre Completo"
        type="text"
        disabled={isLoading}
        errors={errors}
        register={register}
        required
      />
      <Input
        id="password"
        type="password"
        label="Contraseña"
        disabled={isLoading}
        errors={errors}
        register={register}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continuar con Google"
        icon={FcGoogle}
        onClick={() => {
          signIn("google");
        }}
      />
      <Button
        outline
        label="Continuar con Apple"
        icon={AiFillApple}
        onClick={() => {
          signIn("apple");
        }}
      />

      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="flex flex-row items-center gap-2 justify-center">
          <div>¿Ya tienes una cuenta?</div>
          <div
            className="text-neutral-800 cursor-pointer hover:underline"
            onClick={toogle}
          >
            Iniciar sesión
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Registrarse"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;