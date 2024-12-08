'use client'

import { useForm, ControllerRenderProps } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NavigationArrows } from "./ui/navigation-arrows"

const formSchema = z.object({
  ageRange: z.string().min(1, {
    message: "Please select an age range.",
  }),
  gender: z.string().min(1, {
    message: "Please select a gender.",
  }),
  language: z.string().min(1, {
    message: "Please select a language.",
  }),
})

export type PersonalInfoData = z.infer<typeof formSchema>

interface PersonalInfoFormProps {
  onNext: (data: PersonalInfoData) => void | Promise<void>
  initialData?: PersonalInfoData | null
}

export function PersonalInfoForm({ onNext, initialData }: PersonalInfoFormProps) {
  const form = useForm<PersonalInfoData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ageRange: initialData?.ageRange || "",
      gender: initialData?.gender || "",
      language: initialData?.language || "",
    },
  })

  function onSubmit(values: PersonalInfoData) {
    console.log('PersonalInfoForm submitting with language:', values.language); // Debug log
    const formattedValues = {
      ...values,
      language: values.language === 'Spanish' ? 'Spanish' : 'English'
    }
    console.log('PersonalInfoForm formatted values:', formattedValues); // Debug log
    onNext(formattedValues)
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="ageRange"
            render={({ field }: { field: ControllerRenderProps<PersonalInfoData, "ageRange"> }) => (
              <FormItem>
                <FormLabel>Age Range</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your age range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-34">25-34</SelectItem>
                    <SelectItem value="35-44">35-44</SelectItem>
                    <SelectItem value="45-54">45-54</SelectItem>
                    <SelectItem value="55-64">55-64</SelectItem>
                    <SelectItem value="65+">65 or older</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }: { field: ControllerRenderProps<PersonalInfoData, "gender"> }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }: { field: ControllerRenderProps<PersonalInfoData, "language"> }) => (
              <FormItem>
                <FormLabel>Preferred Language</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preferred language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Español</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <NavigationArrows onNext={form.handleSubmit(onSubmit)} showPrevious={false} />
        </form>
      </Form>
    </div>
  )
}