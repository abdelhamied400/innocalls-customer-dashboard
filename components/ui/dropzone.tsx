import React, {
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  useDropzone,
  DropzoneOptions,
  DropzoneState,
  FileRejection,
  ErrorCode,
} from "react-dropzone";
import XIcon from "@mui/icons-material/X";
import UploadIcon from "@mui/icons-material/Upload";

import { formatFileSize } from "@/lib/file";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./button";

// Utility type
type WithId<T> = T & { id: string };

// Errors
const errors: Record<ErrorCode, string> = {
  "file-invalid-type": "Invalid file type",
  "file-too-large": "File is too large",
  "file-too-small": "File is too small",
  "too-many-files": "Too many files",
};

// Context type
interface DropzoneContextType extends Partial<DropzoneState> {
  acceptedFiles: WithId<File>[];
  fileRejections: WithId<FileRejection>[];
  removeFile: (id: string) => void;
  removeRejectedFile: (id: string) => void;
  options?: DropzoneOptions;
  getRootProps: DropzoneState["getRootProps"];
  getInputProps: DropzoneState["getInputProps"];
}

// Create context
const DropzoneContext = createContext<DropzoneContextType | undefined>(
  undefined
);

// Hook
const useDropzoneContext = () => {
  const context = use(DropzoneContext);
  if (!context) {
    throw new Error("Dropzone components must be used within a Dropzone");
  }
  return context;
};

// Root props
type DropzoneRootProps = {
  children: React.ReactNode;
  options?: DropzoneOptions;
  value?: File | null;
  onChange?: (file: File | null) => void;
};

// Dropzone Root
const Dropzone = ({
  children,
  options = {},
  value,
  onChange,
}: DropzoneRootProps) => {
  const [acceptedFiles, setAcceptedFiles] = useState<WithId<File>[]>([]);
  const [fileRejections, setFileRejections] = useState<WithId<FileRejection>[]>(
    []
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      acceptedFiles.forEach((file) => addAcceptedFile(file));
      fileRejections.forEach((rejection) => addRejectedFile(rejection));
    },
    []
  );

  const addAcceptedFile = (file: File) => {
    const fileWithId = new File([file], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    });

    Object.defineProperty(fileWithId, "id", {
      value: uuidv4(),
      writable: false,
      enumerable: true,
    });

    setAcceptedFiles([fileWithId as WithId<File>]);
    setFileRejections([]);

    if (onChange) {
      onChange(fileWithId as WithId<File>);
    }
  };

  const addRejectedFile = (rejection: FileRejection) => {
    setFileRejections((prev) => [...prev, { ...rejection, id: uuidv4() }]);
    if (onChange) {
      onChange(null);
    }
  };

  const removeFile = (id: string) => {
    setAcceptedFiles((prev) => prev.filter((file) => file.id !== id));
    if (onChange) {
      onChange(null);
    }
  };

  const removeRejectedFile = (id: string) => {
    setFileRejections((prev) =>
      prev.filter((rejection) => rejection.id !== id)
    );
  };

  const { getRootProps, getInputProps } = useDropzone({
    ...options,
    onDrop,
  });

  // If form value changes from outside (optional, useful for reset)
  useEffect(() => {
    if (value == null) {
      setAcceptedFiles([]);
      setFileRejections([]);
    }
  }, [value]);

  return (
    <DropzoneContext.Provider
      value={{
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps,
        removeFile,
        removeRejectedFile,
        options,
      }}
    >
      {children}
    </DropzoneContext.Provider>
  );
};

// Components
export const DropzoneTrigger = () => {
  const { getRootProps, getInputProps, options } = useDropzoneContext();
  const acceptedTypes = Object.values(options?.accept || {})
    .map((types) => types.map((type) => type.replace(/^\./, "")).join(", "))
    .join(", ");

  return (
    <section
      className="bg-gray-50 rounded-lg border border-dashed border-gray-300 mb-2"
      role="button"
    >
      <div {...getRootProps({ className: "dropzone p-4" })}>
        <input {...getInputProps()} />
        <div className="flex flex-wrap justify-center gap-2 text-gray-500">
          <UploadIcon />
          <p className="font-bold">Drag File Here</p>
          <p>Or</p>
          <p className="text-primary font-bold">Browse Files</p>
          <br />
          <p>
            (Only <span className="uppercase">{acceptedTypes}</span> ), Max
            Size: {formatFileSize(options?.maxSize)}
          </p>
        </div>
      </div>
    </section>
  );
};

type FileProps = {
  file: WithId<File>;
};
export const DropzoneFile = ({ file }: FileProps) => {
  const { removeFile } = useDropzoneContext();

  return (
    <li className="flex items-center justify-between gap-2 p-4 bg-gray-50 border rounded-lg">
      <div className="flex flex-col">
        <p>{file.name}</p>
        <p className="text-gray-400">
          <small>{formatFileSize(file.size)}</small>
        </p>
      </div>
      <Button
        size="icon"
        variant="destructive"
        type="button"
        onClick={() => removeFile(file.id)}
      >
        <XIcon />
      </Button>
    </li>
  );
};

type DropzoneRejectedFileProps = {
  rejection: WithId<FileRejection>;
};
export const DropzoneRejectedFile = ({
  rejection,
}: DropzoneRejectedFileProps) => {
  const { removeRejectedFile } = useDropzoneContext();

  return (
    <li className="flex items-center justify-between gap-2 p-4 bg-red-50 border border-destructive rounded-lg">
      <div className="flex flex-col">
        <p>{rejection.file.name}</p>
        <p className="text-destructive">
          <small>
            {rejection.errors
              .map((error) => errors[error.code as ErrorCode])
              .join(", ")}
          </small>
        </p>
        <p className="text-gray-400">
          <small>{formatFileSize(rejection.file.size)}</small>
        </p>
      </div>
      <Button
        size="icon"
        variant="destructive"
        type="button"
        onClick={() => removeRejectedFile(rejection.id)}
      >
        <XIcon />
      </Button>
    </li>
  );
};

export const DropzoneFileList = () => {
  const { acceptedFiles, fileRejections } = useDropzoneContext();

  return (
    <ul className="flex flex-col gap-2">
      {acceptedFiles.map((file) => (
        <DropzoneFile key={file.id} file={file} />
      ))}
      {fileRejections.map((rejection) => (
        <DropzoneRejectedFile key={rejection.id} rejection={rejection} />
      ))}
    </ul>
  );
};

export default Dropzone;
