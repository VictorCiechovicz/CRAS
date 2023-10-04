"use client";

import { LoginForm } from "@/src/components/page";
import { useEffect } from "react";

import { signIn } from "next-auth/react";
import Loading from "./loading";

export default function Login() {
  useEffect(() => {
    signIn("keycloak", { callbackUrl: "/home" });
  }, []);
  return <Loading />;
}
