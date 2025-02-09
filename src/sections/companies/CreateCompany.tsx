import React, { Fragment } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { toast } from "react-toastify";

import Select from "@/components/extends/Select/default";
import FormHelperText from "@/components/extends/FormHelperText";

import {
  addCompany,
  updateCompany,
  BaseCompanyModel,
} from "@/services/companyService";
import { runService } from "@/utils/service_utils";
import { useCompanyFilter } from "@/contexts/FilterCompanyContext";

import { statusOptions_2 } from "@/data/filter.data";
import { CreateCompanyProps } from "@/types";

const linkedinRegex =
  /^(https?:\/\/)?(www\.)?(linkedin\.com\/(company)\/[a-zA-Z0-9-]+)/;

export default function CreateCompany({
  open,
  company = undefined,
  handleSave,
  handleClose,
}: CreateCompanyProps) {
  const { setCompanyFilterConfig } = useCompanyFilter();
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative" onClose={handleClose}>
          <div className="fixed inset-0 bg-black/65 z-40" />
          <div className="fixed inset-0 py-10 overflow-y-auto z-40">
            <div className="flex min-h-full items-center justify-center text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="max-w-2xl w-full flex flex-col rounded-md bg-white text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="px-6 py-3 text-lg font-semibold leading-6 bg-white text-gray-900 rounded-md"
                  >
                    {company ? "Edit Company" : "Create New Company"}
                  </DialogTitle>
                  <Formik
                    initialValues={{
                      name: company ? company.name : "",
                      phone: company ? company.phone : "",
                      phoneStatus: company ? company.phoneStatus : "",
                      companyType: company ? company.companyType : "",
                      description: company ? company.description : "",
                      size: company ? company.size : 0,
                      industry: company ? company.industry : "",
                      linkedin: company ? company.linkedin : "",
                      streetAddress: company ? company.streetAddress : "",
                      city: company ? company.city : "",
                      state: company ? company.state : "",
                      country: company ? company.country : "",
                      postalCode: company ? company.postalCode : "",
                      yearFounded: company ? company.yearFounded : "",
                      domain: company ? company.domain : "",
                      annualRevenue: company ? company.annualRevenue : "",
                      keywords: company ? company.keywords : "",
                    }}
                    validationSchema={Yup.object().shape({
                      name: Yup.string().required("Name is required"),
                      phone: Yup.string().required("Phone is required"),
                      // phoneStatus: Yup.string().required("Status is required"),
                      companyType: Yup.string().required("Type is required"),
                      size: Yup.number().required("Size is required"),
                      linkedin: Yup.string()
                        .matches(
                          linkedinRegex,
                          "Please enter a valid LinkedIn URL"
                        )
                        .required("LinkedIn URL is required"),
                      // location: Yup.string().required("Location is required"),
                      streetAddress: Yup.string().required(
                        "Street Address is required"
                      ),
                      city: Yup.string().required("City is required"),
                      state: Yup.string().required("State is required"),
                      country: Yup.string().required("Country is required"),
                      postalCode: Yup.string().required(
                        "Postal Code is required"
                      ),
                      yearFounded: Yup.string().required(
                        "yearFounded is required"
                      ),
                      domain: Yup.string().required("Domain is required"),
                      annualRevenue: Yup.string().required(
                        "Annual Revenue is required"
                      ),
                      // keywords: Yup.string().required("Keywords is required"),
                    })}
                    onSubmit={async (
                      values,
                      { setErrors, setStatus, setSubmitting }
                    ) => {
                      console.log("submit");
                      setSubmitting(true);
                      let companyData: BaseCompanyModel = {
                        name: values.name,
                        linkedin: values.linkedin,
                        companyType: values.companyType,
                        phone: values.phone,
                        phoneStatus: values.phoneStatus,
                        description: values.description,
                        industry: values.industry,
                        streetAddress: values.streetAddress,
                        city: values.city,
                        state: values.state,
                        country: values.country,
                        postalCode: values.postalCode,
                        yearFounded: values.yearFounded,
                        domain: values.domain,
                        annualRevenue: values.annualRevenue,
                        keywords: values.keywords,
                        size: values.size,
                        targeted: false,
                      };
                      company
                        ? runService(
                            { id: company.id, updateData: companyData },
                            updateCompany,
                            (data) => {
                              setCompanyFilterConfig((prev) => ({
                                ...prev,
                                createdCompanyId: data.id,
                              }));
                              toast.success("Company updated successfully");
                              handleSave();
                              handleClose();
                            },
                            (status, error) => {
                              console.log(status, error);
                              toast.error(error);
                            }
                          )
                        : runService(
                            companyData,
                            addCompany,
                            (data) => {
                              setCompanyFilterConfig((prev) => ({
                                ...prev,
                                createdCompanyId: data.id,
                              }));
                              toast.success("Company created successfully");
                              handleSave();
                              handleClose();
                            },
                            (status, error) => {
                              console.log(status, error);
                              toast.error(error);
                            }
                          );
                      setSubmitting(false);
                    }}
                  >
                    {({
                      errors,
                      handleBlur,
                      handleChange,
                      setFieldValue,
                      handleSubmit,
                      isSubmitting,
                      touched,
                      values,
                    }) => (
                      <form noValidate onSubmit={handleSubmit}>
                        <div className="px-6 py-3 flex flex-col gap-2 text-sm bg-gray-50 rounded-md">
                          <div className="flex flex-col">
                            <label htmlFor="name">Company Name</label>
                            <input
                              id="name"
                              type="text"
                              placeholder="Company Name"
                              className="input-primary"
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {touched.name && errors.name && (
                              <FormHelperText>{errors.name}</FormHelperText>
                            )}
                          </div>

                          <div className="flex flex-col">
                            <label htmlFor="jobTitle">Company Phone</label>
                            <div className="flex gap-4">
                              <div className="w-full flex flex-col">
                                <input
                                  id="phone"
                                  type="text"
                                  placeholder="Phone Number"
                                  className="input-primary"
                                  value={values.phone}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                {touched.phone && errors.phone && (
                                  <FormHelperText>
                                    {errors.phone}
                                  </FormHelperText>
                                )}
                              </div>
                              <div className="w-full flex flex-col">
                                <Select
                                  data={statusOptions_2}
                                  defaultValue={statusOptions_2.find(
                                    (option) =>
                                      option.value === values.phoneStatus
                                  )}
                                  onChange={(selectedItem) => {
                                    if (
                                      selectedItem &&
                                      selectedItem.value !== values.phoneStatus
                                    )
                                      setFieldValue(
                                        "phoneStatus",
                                        selectedItem.value
                                      );
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <label htmlFor="companyType">Company Type</label>
                            <input
                              id="companyType"
                              type="text"
                              placeholder="Company Type"
                              className="input-primary"
                              value={values.companyType}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {touched.companyType && errors.companyType && (
                              <FormHelperText>
                                {errors.companyType}
                              </FormHelperText>
                            )}
                          </div>

                          <div className="flex flex-col">
                            <label htmlFor="industry">Industry</label>
                            <input
                              id="industry"
                              type="text"
                              placeholder="Industry"
                              className="input-primary"
                              value={values.industry}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {touched.industry && errors.industry && (
                              <FormHelperText>{errors.industry}</FormHelperText>
                            )}
                          </div>

                          <div className="flex flex-col">
                            <label htmlFor="description">Description</label>
                            <textarea
                              id="description"
                              className="input-primary"
                              value={values.description}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </div>

                          <div className="flex flex-col">
                            <label htmlFor="size">Company Size</label>
                            <input
                              id="size"
                              type="number"
                              placeholder="Company Size"
                              className="input-primary"
                              value={values.size}
                              onChange={(e) => {
                                setFieldValue("size", parseInt(e.target.value));
                              }}
                              onBlur={handleBlur}
                            />
                          </div>

                          <div className="flex flex-col">
                            <label htmlFor="linkedin">LinkedIn URL</label>
                            <input
                              id="linkedin"
                              type="text"
                              placeholder="http://linkedin/company/contactname"
                              className="input-primary"
                              value={values.linkedin}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {touched.linkedin && errors.linkedin && (
                              <FormHelperText>{errors.linkedin}</FormHelperText>
                            )}
                          </div>
                          <div className="flex flex-row gap-2">
                            <div className="flex flex-col">
                              <label htmlFor="streetAddress">
                                Street Address
                              </label>
                              <input
                                id="streetAddress"
                                type="text"
                                placeholder="Street Address"
                                className="input-primary"
                                value={values.streetAddress}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {touched.streetAddress &&
                                errors.streetAddress && (
                                  <FormHelperText>
                                    {errors.streetAddress}
                                  </FormHelperText>
                                )}
                            </div>

                            <div className="flex flex-col">
                              <label htmlFor="city">City</label>
                              <input
                                id="city"
                                type="text"
                                placeholder="City"
                                className="input-primary"
                                value={values.city}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {touched.city && errors.city && (
                                <FormHelperText>{errors.city}</FormHelperText>
                              )}
                            </div>

                            <div className="flex flex-col">
                              <label htmlFor="state">State</label>
                              <input
                                id="state"
                                type="text"
                                placeholder="State"
                                className="input-primary"
                                value={values.state}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {touched.state && errors.state && (
                                <FormHelperText>{errors.state}</FormHelperText>
                              )}
                            </div>

                            <div className="flex flex-col">
                              <label htmlFor="country">Country</label>
                              <input
                                id="country"
                                type="text"
                                placeholder="Country"
                                className="input-primary"
                                value={values.country}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {touched.country && errors.country && (
                                <FormHelperText>
                                  {errors.country}
                                </FormHelperText>
                              )}
                            </div>

                            <div className="flex flex-col">
                              <label htmlFor="postalCode">Postal Code</label>
                              <input
                                id="postalCode"
                                type="text"
                                placeholder="Postal Code"
                                className="input-primary"
                                value={values.postalCode}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {touched.postalCode && errors.postalCode && (
                                <FormHelperText>
                                  {errors.postalCode}
                                </FormHelperText>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-row gap-2">
                            <div className="w-full flex flex-col">
                              <label htmlFor="yearFounded">Year Founded</label>
                              <input
                                id="yearFounded"
                                type="text"
                                placeholder="Year Founded"
                                className="input-primary"
                                value={values.yearFounded}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {touched.yearFounded && errors.yearFounded && (
                                <FormHelperText>
                                  {errors.yearFounded}
                                </FormHelperText>
                              )}
                            </div>

                            <div className="w-full flex flex-col">
                              <label htmlFor="domain">Domain</label>
                              <input
                                id="domain"
                                type="text"
                                placeholder="Domain"
                                className="input-primary"
                                value={values.domain}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {touched.domain && errors.domain && (
                                <FormHelperText>{errors.domain}</FormHelperText>
                              )}
                            </div>

                            <div className="w-full flex flex-col">
                              <label htmlFor="annualRevenue">
                                Annual Revenue
                              </label>
                              <input
                                id="annualRevenue"
                                type="text"
                                placeholder="Year Founded"
                                className="input-primary"
                                value={values.annualRevenue}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {touched.annualRevenue &&
                                errors.annualRevenue && (
                                  <FormHelperText>
                                    {errors.yearFounded}
                                  </FormHelperText>
                                )}
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <label htmlFor="keywords">Keywords</label>
                            <input
                              id="keywords"
                              type="text"
                              placeholder="Keywords (e.g. media,messaging,camera,technology,innovation)"
                              className="input-primary"
                              value={values.keywords}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {touched.keywords && errors.keywords && (
                              <FormHelperText>{errors.keywords}</FormHelperText>
                            )}
                          </div>

                          <div className="pt-2 flex justify-end gap-4">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="btn-primary"
                            >
                              {company ? "Update Company" : "Create Company"}
                            </button>
                            <button
                              className="btn-secondary"
                              onClick={handleClose}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
