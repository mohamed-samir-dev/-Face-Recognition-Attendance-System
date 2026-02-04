import { forwardRef } from "react";
import {FileInputProps}from "../types"


const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  function FileInput({ onChange }, ref) {
    return (
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        onChange={onChange}
        className="hidden"
      />
    );
  }
);

export default FileInput;