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
import UploadIcon from "@mui/icons-material/Upload";

import { formatFileSize } from "@/lib/file";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./button";
import { Close } from "@mui/icons-material";
import { useTranslations } from "@/providers/TranslationProvider";

// Utility type
type WithId<T> = T & { id: string };

// Context type
interface DropzoneContextType extends Partial<DropzoneState> {
  acceptedFiles: WithId<File>[];
  fileRejections: WithId<FileRejection>[];
  removeFile: (id: string) => void;
  removeRejectedFile: (id: string) => void;
  options?: DropzoneOptions;
  getRootProps: DropzoneState["getRootProps"];
  getInputProps: DropzoneState["getInputProps"];
  fakeFilesState: string[];
  removeFakeFile: (fileName: string) => void;
  disabled?: boolean;
}

// Create context
const DropzoneContext = createContext<DropzoneContextType | undefined>(
  undefined,
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
  fakeFiles?: string[];
  removeFakeFile?: (fileName: string) => void;
  disabled?: boolean;
};

// Dropzone Root
const Dropzone = ({
  children,
  options = {},
  value,
  onChange,
  fakeFiles = [],
  removeFakeFile: onRemoveFakeFile,
  disabled,
}: DropzoneRootProps) => {
  const [acceptedFiles, setAcceptedFiles] = useState<WithId<File>[]>([]);
  const [fileRejections, setFileRejections] = useState<WithId<FileRejection>[]>(
    [],
  );
  const [fakeFilesState, setFakeFilesState] = useState<string[]>(fakeFiles);

  const addAcceptedFile = useCallback(
    (file: File) => {
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
    },
    [onChange],
  );

  const addRejectedFile = useCallback(
    (rejection: FileRejection) => {
      setFileRejections((prev) => [...prev, { ...rejection, id: uuidv4() }]);
      if (onChange) {
        onChange(null);
      }
    },
    [onChange],
  );

  const removeFile = useCallback(
    (id: string) => {
      setAcceptedFiles((prev) => prev.filter((file) => file.id !== id));
      if (onChange) {
        onChange(null);
      }
    },
    [onChange],
  );

  const removeRejectedFile = useCallback((id: string) => {
    setFileRejections((prev) =>
      prev.filter((rejection) => rejection.id !== id),
    );
  }, []);

  const removeFakeFile = useCallback(
    (fileName: string) => {
      setFakeFilesState((prev) => prev.filter((name) => name !== fileName));
      onRemoveFakeFile?.(fileName);
    },
    [onRemoveFakeFile],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      acceptedFiles.forEach((file) => addAcceptedFile(file));
      fileRejections.forEach((rejection) => addRejectedFile(rejection));
    },
    [addAcceptedFile, addRejectedFile],
  );

  const { getRootProps, getInputProps } = useDropzone({
    ...options,
    onDrop,
    disabled,
  });

  // If form value changes from outside (optional, useful for reset)
  useEffect(() => {
    if (value == null) {
      setTimeout(() => {
        setAcceptedFiles([]);
        setFileRejections([]);
      }, 0);
    }
  }, [value]);

  useEffect(() => {
    if (!!value) {
      const fileWithId = new File([value], value.name, {
        type: value.type,
        lastModified: value.lastModified,
      });

      Object.defineProperty(fileWithId, "id", {
        value: uuidv4(),
        writable: false,
        enumerable: true,
      });

      setTimeout(() => {
        setAcceptedFiles([fileWithId as WithId<File>]);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        fakeFilesState,
        removeFakeFile,
        disabled,
      }}
    >
      {children}
    </DropzoneContext.Provider>
  );
};

// Components
export const DropzoneTrigger = () => {
  const t = useTranslations("common.dropzone");
  const { getRootProps, getInputProps, options, disabled } =
    useDropzoneContext();
  const acceptedTypes = Object.values(options?.accept || {})
    .map((types) => types.map((type) => type.replace(/^\./, "")).join(", "))
    .join(", ");

  return (
    <section
      className={`bg-gray-50 rounded-lg border border-dashed border-gray-300 mb-2 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      role="button"
    >
      <div {...getRootProps({ className: "dropzone p-4" })}>
        <input {...getInputProps()} />
        <div className="text-gray-500 flex flex-col items-center">
          <div className="flex flex-wrap gap-1">
            <UploadIcon />
            <p className="font-bold">{t("drag")}</p>
            <p>{t("or")}</p>
            <p className="text-primary font-bold">{t("browseFiles")}</p>
          </div>
          <p>
            ({t("only")} <span className="uppercase">{acceptedTypes}</span> ),{" "}
            {t("max")} {t("size")}: {formatFileSize(options?.maxSize)}
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
        <Close />
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
  const t = useTranslations("common.dropzone");
  const { removeRejectedFile } = useDropzoneContext();

  // Errors
  const errors: Record<ErrorCode, string> = {
    "file-invalid-type": t("validation.file-invalid-type"),
    "file-too-large": t("validation.file-too-large"),
    "file-too-small": t("validation.file-too-small"),
    "too-many-files": t("validation.too-many-files"),
  };

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
        <Close />
      </Button>
    </li>
  );
};

const DropzoneFakeFile = ({ fileName }: { fileName: string }) => {
  const { removeFakeFile, disabled } = useDropzoneContext();

  return (
    <li className="flex items-center justify-between gap-2 p-4 bg-gray-50 border rounded-lg">
      <div className="flex flex-col">
        <p>{fileName}</p>
      </div>
      <Button
        size="icon"
        variant="destructive"
        type="button"
        disabled={disabled}
        onClick={() => removeFakeFile(fileName)}
      >
        <Close />
      </Button>
    </li>
  );
};

export const DropzoneFileList = () => {
  const { acceptedFiles, fileRejections, fakeFilesState } =
    useDropzoneContext();

  if (
    acceptedFiles.length === 0 &&
    fileRejections.length === 0 &&
    fakeFilesState.length === 0
  ) {
    return null;
  }

  return (
    <ul className="flex flex-col gap-2">
      {fakeFilesState.map((fileName) => (
        <DropzoneFakeFile key={fileName} fileName={fileName} />
      ))}
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
