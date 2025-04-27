"use client"

import type React from "react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Upload, Heart, Plus, X } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const formSchema = z.object({
  name: z.string().min(2, { message: "Charity name must be at least 2 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  goal: z.string().min(1, { message: "Please enter a goal amount." }),
  location: z.string().min(2, { message: "Please enter a valid location." }),
  neededItem: z.string().optional(), // This is for the input field, not stored in final form data
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, { message: "File size should be less than 5MB." })
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function CharityForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [neededItems, setNeededItems] = useState<string[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      goal: "",
      location: "",
      neededItem: "",
    },
  })

  const addNeededItem = () => {
    const neededItem = form.getValues("neededItem")
    if (neededItem && neededItem.trim() !== "") {
      setNeededItems([...neededItems, neededItem.trim()])
      form.setValue("neededItem", "")
    }
  }

  const removeNeededItem = (index: number) => {
    const updatedItems = [...neededItems]
    updatedItems.splice(index, 1)
    setNeededItems(updatedItems)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addNeededItem()
    }
  }

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      // Check if file is selected
      if (!selectedFile) {
        toast({
          title: "Image required",
          description: "Please upload an image for the charity.",
          variant: "destructive",
        })
        setIsSubmitting(false)

        return
      }

      // Check if at least one needed item is added
      if (neededItems.length === 0) {
        toast({
          title: "Items needed required",
          description: "Please add at least one item that is needed.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      console.log("Form data before submission:", data)
      console.log("Needed items:", neededItems)
      console.log("Selected file before submission:", selectedFile)

      // Create FormData for the file upload
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("description", data.description)
      formData.append("goal", data.goal)
      formData.append("location", data.location)

      // Add the needed items as a JSON string
      // formData.append("needed", JSON.stringify(neededItems))

       // Append each item in neededItems as an array
    neededItems.forEach((item) => {
      formData.append("needed[]", item) // Use "needed[]" for array format
    })

      // Explicitly add the file with the correct field name
      formData.append("image", selectedFile)

      // Log all form data entries for debugging
      console.log("FormData contents:")
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${typeof pair[1] === "object" ? "File: " + (pair[1] as File).name : pair[1]}`)
      }

      // Use axios directly for better debugging
      const response = await axios.post("https://liwedoc.vercel.app/charities", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Submission successful:", response.data)

      toast({
        title: "Charity submitted",
        description: "Your charity has been successfully submitted.",
      })

      form.reset()
      setSelectedFileName("")
      setSelectedFile(null)
      setNeededItems([])
    } catch (error: any) {
      console.error("Submission error:", error)

      // Log detailed error information
      if (error.response) {
        console.error("Error response:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        })
      }

      const errorMessage = error.response?.data?.error || "Your charity couldn't be submitted. Please try again."

      toast({
        title: "Something went wrong",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      router.push("/admin/charity")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    console.log("File input change event:", files)

    if (files && files.length > 0) {
      const file = files[0]
      console.log("File selected:", file.name, file.type, file.size)

      setSelectedFileName(file.name)
      setSelectedFile(file)
      form.setValue("image", file)
    } else {
      console.log("No file selected or file selection cleared")
      setSelectedFileName("")
      setSelectedFile(null)
      form.setValue("image", undefined)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-emerald-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-emerald-600" />
          <CardTitle className="text-emerald-700">Register a Charity</CardTitle>
        </div>
        <CardDescription>Submit your charity details to help those in need</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Charity Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter charity name" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the charity's mission and purpose..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fundraising Goal</FormLabel>
                    <FormControl>
                      <Input placeholder="$10,000" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="neededItem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Items/Resources Needed</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="Add items needed by the charity..." {...field} onKeyDown={handleKeyDown} />
                    </FormControl>
                    <Button type="button" onClick={addNeededItem} className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage className="text-red-500" />

                  {/* Display added items */}
                  {neededItems.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground mb-2">Added items:</p>
                      <div className="flex flex-wrap gap-2">
                        {neededItems.map((item, index) => (
                          <Badge key={index} className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-3 py-1">
                            {item}
                            <button
                              type="button"
                              onClick={() => removeNeededItem(index)}
                              className="ml-2 text-emerald-700 hover:text-emerald-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>
                    Charity Image <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="charityImage"
                          className="flex items-center gap-2 px-4 py-2 border border-emerald-600 rounded-md cursor-pointer hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Choose image</span>
                        </label>
                        {selectedFileName && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{selectedFileName}</span>
                            {selectedFile && (
                              <span className="text-xs text-muted-foreground">
                                ({Math.round(selectedFile.size / 1024)} KB)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <Input
                        id="charityImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        {...rest}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                  {selectedFile && (
                    <div className="mt-2">
                      <p className="text-xs text-green-600">File selected: {selectedFile.name}</p>
                    </div>
                  )}
                </FormItem>
              )}
            />

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className={`px-8 ${
                  isSubmitting ? "bg-gray-400 text-white" : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Charity"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4 bg-gray-50 rounded-b-lg">
        <p className="text-sm text-muted-foreground">
          Thank you for your contribution to making the world a better place
        </p>
      </CardFooter>
    </Card>
  )
}
