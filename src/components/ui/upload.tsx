import * as React from "react"
import { cn } from "@/lib/utils"

export interface UploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelect?: (files: FileList | null) => void
}

const Upload = React.forwardRef<HTMLInputElement, UploadProps>(
  ({ className, onFileSelect, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onFileSelect?.(e.target.files)
      props.onChange?.(e)
    }

    return (
      <input
        type="file"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
Upload.displayName = "Upload"

export { Upload }