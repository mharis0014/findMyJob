import * as yup from 'yup'

import {STRINGS} from '../constants/strings'

const V = STRINGS.companySignup.validation

export const companySignupSchema = yup.object({
  name: yup.string().min(3, V.name.min).required(V.name.required),
  email: yup.string().email(V.email.invalid).required(V.email.required),
  contact: yup.string().matches(/^\d+$/, V.contact.invalid).required(V.contact.required),
  companyName: yup.string().required(V.companyName.required),
  address: yup.string().required(V.address.required),
  password: yup.string().min(6, V.password.min).required(V.password.required),
})

export const companyLoginSchema = yup.object({
  email: yup.string().email(V.email.invalid).required(V.email.required),
  password: yup.string().min(6, V.password.min).required(V.password.required),
})

export const companyEditProfileSchema = yup.object({
  name: yup.string().min(3, V.name.min).required(V.name.required),
  email: yup.string().email(V.email.invalid).required(V.email.required),
  contact: yup.string().matches(/^\d+$/, V.contact.invalid).required(V.contact.required),
  companyName: yup.string().required(V.companyName.required),
  address: yup.string().required(V.address.required),
})

export const JobSchema = yup.object({
  jobTitle: yup.string().required('Job Title is required'),
  jobDesc: yup
    .string()
    .min(50, 'Minimum 50 characters required')
    .required('Job Description is required'),
  selectedCategory: yup.string().required('Category is required'),
  selectedSkill: yup.string().required('Skill is required'),
  experience: yup.string().required('Experience is required'),
  salaryPackage: yup.string().required('Salary Package is required'),
  company: yup.string().required('Company name is required'),
})
