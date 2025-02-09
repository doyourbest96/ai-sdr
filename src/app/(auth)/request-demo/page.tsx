"use client";
import Link from "next/link";

import { useState } from "react";
import { ROUTE_DASHBOARD, ROUTE_LOGIN } from "@/data/routes";
import Logo from "@/components/extends/Logo";
import { LOGIN_BG_URL, LOGIN_SUB_IMAGE_001_URL } from "@/data/urls/images.url";
import Image from "next/image";
import { Formik, yupToFormErrors } from "formik";
import * as Yup from "yup";
import FormHelperText from "@/components/extends/FormHelperText";
import Select from "@/components/extends/Select/default";
import { handleError, runService } from "@/utils/service_utils";
import { requestDemo, saveToken } from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const companySizeOptions = [
  { value: "1-10", name: "1-10" },
  { value: "11-20", name: "11-20" },
  { value: "21-50", name: "21-50" },
  { value: "51-100", name: "51-100" },
  { value: "101-200", name: "101-200" },
  { value: "201-500", name: "201-500" },
  { value: "501-1000", name: "501-1000" },
  { value: "1001-2000", name: "1001-2000" },
  { value: "2001-5000", name: "2001-5000" },
  { value: "5001-10000", name: "5001-10000" },
  { value: "10001+", name: "10001+" },
];

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const invite = Object.fromEntries(useSearchParams())?.invite;
  const router = useRouter();
  const handleRegister = (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    companyName?: string,
    companySize?: string
  ) => {
    setIsLoading(true);
    console.log("sending request");
    runService(
      {
        user: {
          email,
          password,
          firstName,
          lastName,
          companyName,
          companySize,
        },
        invite,
      },
      requestDemo,
      (data) => {
        saveToken(data.token);
        toast.success(
          "Successfully requested a demo! We'll contact to you soon."
        );
        router.push(ROUTE_LOGIN);
        setIsLoading(false);
      },
      (statusCode, error) => {
        handleError(statusCode, error);
        setIsLoading(false);
      }
    );
  };

  return (
    <>
      <div className="flex min-h-dvh flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Logo />
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight">
                Request a demo
              </h2>
            </div>
            <p className="mt-2 text-sm leading-6 ">
              Already a member?{" "}
              <Link
                href={ROUTE_LOGIN}
                className="font-semibold underline hover:text-blue-500"
              >
                Login
              </Link>
            </p>
            <div className="mt-10">
              <div>
                <Formik
                  initialValues={{
                    firstName: "",
                    lastName: "",
                    companyName: undefined,
                    companySize: undefined,
                    email: "",
                    password: "",
                    invite: invite ? true : false,
                    submit: null,
                  }}
                  validationSchema={Yup.object().shape({
                    firstName: Yup.string().required("First name is required"),
                    lastName: Yup.string().required("Last name is required"),
                    companyName: Yup.string().when("invite", {
                      is: false,
                      then: (schema) =>
                        schema.required("Company name is required"),
                      otherwise: (schema) => schema.notRequired(),
                    }),
                    companySize: Yup.string().when("invite", {
                      is: false,
                      then: (schema) =>
                        schema.required("Company size is required"),
                      otherwise: (schema) => schema.notRequired(),
                    }),
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
                    await handleRegister(
                      values.email,
                      values.password,
                      values.firstName,
                      values.lastName,
                      values.companyName,
                      values.companySize
                    );
                    setSubmitting(false);
                  }}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    isSubmitting,
                    touched,
                    values,
                  }) => (
                    <form
                      noValidate
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="flex gap-4">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium leading-6 "
                          >
                            First Name
                          </label>
                          <div className="mt-2">
                            <input
                              id="firstName"
                              name="firstName"
                              type="text"
                              value={values.firstName}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              required
                              autoComplete="text"
                              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                            />
                          </div>
                          {touched.firstName && errors.firstName && (
                            <FormHelperText>{errors.firstName}</FormHelperText>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium leading-6 "
                          >
                            Last Name
                          </label>
                          <div className="mt-2">
                            <input
                              id="lastName"
                              name="lastName"
                              type="text"
                              value={values.lastName}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              required
                              autoComplete="text"
                              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                            />
                          </div>
                          {touched.lastName && errors.lastName && (
                            <FormHelperText>{errors.lastName}</FormHelperText>
                          )}
                        </div>
                      </div>
                      {(invite === undefined || invite === "") && (
                        <div className="flex gap-4">
                          <div className="w-full">
                            <label
                              htmlFor="companyName"
                              className="block text-sm font-medium leading-6 "
                            >
                              Company Name
                            </label>
                            <div className="mt-2">
                              <input
                                id="companyName"
                                name="companyName"
                                type="text"
                                value={values.companyName}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                required
                                autoComplete="text"
                                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                              />
                            </div>
                            {touched.companyName && errors.companyName && (
                              <FormHelperText>
                                {errors.companyName}
                              </FormHelperText>
                            )}
                          </div>
                          <div className="w-full">
                            <label
                              htmlFor="companyName"
                              className="block text-sm font-medium leading-6 "
                            >
                              Company Size
                            </label>
                            <div className="mt-2">
                              <Select
                                data={companySizeOptions}
                                onChange={(selectedItem) => {
                                  if (selectedItem.value !== values.companySize)
                                    setFieldValue(
                                      "companySize",
                                      selectedItem.value
                                    );
                                }}
                              />
                            </div>
                            {touched.companySize && errors.companySize && (
                              <FormHelperText>
                                {errors.companySize}
                              </FormHelperText>
                            )}
                          </div>
                        </div>
                      )}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 "
                        >
                          Business Email
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={values.email}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
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
                            onBlur={handleBlur}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                          />
                        </div>
                        {touched.password && errors.password && (
                          <FormHelperText>{errors.password}</FormHelperText>
                        )}
                      </div>

                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting || isLoading}
                          className="btn-primary flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 !disabled:bg-gray-400"
                        >
                          Request a demo
                        </button>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <Image
            alt=""
            src={LOGIN_BG_URL}
            width={1200}
            height={800}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full flex-center">
            <Image
              alt=""
              src={LOGIN_SUB_IMAGE_001_URL}
              width={1200}
              height={800}
              className="w-full aspect-auto max-w-[800px] px-8"
            />
          </div>
        </div>
      </div>
    </>
  );
}
