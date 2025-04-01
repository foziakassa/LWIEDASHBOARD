"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Save, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "image"
  | "file"
  | "location"
  | "price"
  | "condition"

interface FieldAdderProps {
  onAddField: (field: {
    name: string
    label: string
    type: FieldType
    required: boolean
    options?: string[]
  }) => void
  entityName: string
}

export function FieldAdder({ onAddField, entityName }: FieldAdderProps) {
  const [open, setOpen] = useState(false)
  const [fieldName, setFieldName] = useState("")
  const [fieldLabel, setFieldLabel] = useState("")
  const [fieldType, setFieldType] = useState<FieldType>("text")
  const [isRequired, setIsRequired] = useState(false)
  const [options, setOptions] = useState<string[]>([])
  const [newOption, setNewOption] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newField = {
      name: fieldName.trim().toLowerCase().replace(/\s+/g, "_"),
      label: fieldLabel,
      type: fieldType,
      required: isRequired,
      options: ["select", "radio", "checkbox"].includes(fieldType) ? options : undefined,
    }

    onAddField(newField)
    resetForm()
    setOpen(false)
  }

  const resetForm = () => {
    setFieldName("")
    setFieldLabel("")
    setFieldType("text")
    setIsRequired(false)
    setOptions([])
    setNewOption("")
  }

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()])
      setNewOption("")
    }
  }

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Add Custom Field
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Custom Field to {entityName}</DialogTitle>
          <DialogDescription>Create a new custom field to collect additional information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field-name">Field Name</Label>
              <Input
                id="field-name"
                placeholder="e.g. product_color"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">System name, no spaces allowed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-label">Display Label</Label>
              <Input
                id="field-label"
                placeholder="e.g. Product Color"
                value={fieldLabel}
                onChange={(e) => setFieldLabel(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Label shown to users</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-type">Field Type</Label>
            <Select value={fieldType} onValueChange={(value) => setFieldType(value as FieldType)}>
              <SelectTrigger id="field-type">
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="textarea">Text Area</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="select">Dropdown</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="radio">Radio Buttons</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="image">Image Upload</SelectItem>
                <SelectItem value="file">File Upload</SelectItem>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="condition">Condition</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {["select", "radio", "checkbox"].includes(fieldType) && (
            <div className="space-y-2 border rounded-md p-3">
              <Label>Options</Label>
              <div className="flex gap-2 mb-2">
                <Input placeholder="Add an option" value={newOption} onChange={(e) => setNewOption(e.target.value)} />
                <Button type="button" onClick={handleAddOption} disabled={!newOption.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {options.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {options.map((option, index) => (
                    <Badge key={index} className="flex items-center gap-1 py-1 px-3">
                      {option}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleRemoveOption(index)} />
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No options added yet</p>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch id="required" checked={isRequired} onCheckedChange={setIsRequired} />
            <Label htmlFor="required">This field is required</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !fieldName ||
                !fieldLabel ||
                (["select", "radio", "checkbox"].includes(fieldType) && options.length === 0)
              }
            >
              <Save className="mr-2 h-4 w-4" /> Add Field
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

