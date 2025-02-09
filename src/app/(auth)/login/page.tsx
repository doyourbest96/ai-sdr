"use client";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

import Logo from "@/components/extends/Logo";
import CheckBox from "@/components/extends/CheckBox";
import FormHelperText from "@/components/extends/FormHelperText";
import ForgotPassword from "@/sections/auth/ForgotPassword";

import { LOGIN_BG_URL, LOGIN_SUB_IMAGE_001_URL } from "@/data/urls/images.url";
import { ROUTE_DASHBOARD, ROUTE_REQUEST_DEMO } from "@/data/routes";
import {
  login,
  removeRememberMe,
  saveRememberMe,
  sendResetLink,
} from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import { handleError, runService } from "@/utils/service_utils";

export default function SignIn() {
  const [forgot, setForgot] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {setToken} = useAuth();

  const handleLogin = async (email: string, password: string) => {
    await runService(
      { email, password },
      login,
      (data) => {
        if (rememberMe) saveRememberMe(data.token);
        else removeRememberMe();

        setToken(data.token);
      },
      (statusCode, error) => {
        handleError(statusCode, error);
      }
    );
  };
  return (
    <>
      <ForgotPassword
        open={forgot}
        handleSend={(email: string) => {
          runService(
            { email },
            sendResetLink,
            (data) => {
              if (data.success === true) {
                toast.success("Reset link has been sent to your email.");
              } else toast.error("Something goes wrong.");
            },
            (status, error) => {
              handleError(status, error);
            }
          );
          setForgot(false);
        }}
        handleClose={() => setForgot(false)}
      />
      <div className="flex min-h-dvh flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Logo />
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm leading-6 ">
                Not a member?{" "}
                <Link
                  href={ROUTE_REQUEST_DEMO}
                  className="font-semibold underline hover:text-blue-500"
                >
                  Request a demo
                </Link>
              </p>
            </div>

            <div className="mt-10">
              <div>
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                    submit: null,
                  }}
                  validationSchema={Yup.object().shape({
                    email: Yup.string()
                      .email("Must be a valid email")
                      .max(255)
                      .required("Email is required"),
                    password: Yup.string()
                      .max(255)
                      .required("Password is required"),
                  })}
                  onSubmit={async (
                    values,
                    { setErrors, setStatus, setSubmitting }
                  ) => {
                    setSubmitting(true);
                    await handleLogin(values.email, values.password);
                    setSubmitting(false);
                  }}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                  }) => (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 "
                        >
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            autoComplete="email"
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-900  sm:text-sm sm:leading-6 "
                          />
                        </div>
                        {touched.email && errors.email && (
                          <FormHelperText>{errors.email}</FormHelperText>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium leading-6 "
                        >
                          Password
                        </label>
                        <div className="mt-2">
                          <input
                            id="password"
                            name="password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            autoComplete="current-password"
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-900 sm:text-sm sm:leading-6"
                          />
                        </div>
                        {touched.password && errors.password && (
                          <FormHelperText>{errors.password}</FormHelperText>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <CheckBox
                          id="remember-me"
                          content="Remember me"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                        />

                        <div className="text-sm leading-6">
                          <a
                            href="#"
                            className="font-semibold hover:underline hover:text-blue-500"
                            onClick={() => setForgot(true)}
                          >
                            Forgot password?
                          </a>
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-primary flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                          Sign in
                        </button>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
              <div className="mt-10">
                {/* <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className=" px-6 toogle-white color-primary">
                      Or continue with
                    </span>
                  </div>
                </div> */}

                {/* <div className="mt-6 grid grid-cols-1 gap-4">
                  <Link
                    href="#"
                    className="btn-primary flex w-full items-center justify-center gap-3 rounded-md  px-3 py-2 text-sm font-semibold  shadow-sm"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-5 w-5"
                    >
                      <path
                        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                        fill="#EA4335"
                      />
                      <path
                        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                        fill="#34A853"
                      />
                    </svg>
                    <span className="text-sm font-semibold leading-6 text-white">
                      Google
                    </span>
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <Image
            alt="Sign In Background Image"
            src={LOGIN_BG_URL}
            width={1200}
            height={800}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full flex-center">
            <Image
              alt="Sign In Background Image"
              src={LOGIN_SUB_IMAGE_001_URL}
              width={400}
              height={300}
              className="w-full aspect-auto max-w-[800px] px-8"
            />
          </div>
        </div>
      </div>
    </>
  );
}
