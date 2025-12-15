import { FileInput, Label } from "flowbite-react";
import { useRef, useState, memo, useEffect, useId } from "react";
import { RiFileUploadFill } from "react-icons/ri";
import { FaFileAlt } from "react-icons/fa";

const InputFile = ({
  className = "",
  title = "",
  subtitle = "",
  id,
  onChange,          // ✅ take parent's onChange explicitly
  ...rest
}) => {
  const autoId = useId();
  const inputId = id || `dropzone-${autoId}`;

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // ✅ cleanup object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // revoke old preview (if any)
    if (preview) URL.revokeObjectURL(preview);

    setFile(selected);

    const isImage =
      selected.type?.startsWith("image/") ||
      /\.(png|jpe?g|gif|webp)$/i.test(selected.name);

    if (isImage) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }

    // ✅ call parent handler AFTER we update preview
    onChange?.(e);

    // ✅ optional: allow selecting the same file again
    // e.target.value = "";
  };

  const isPDF =
    file?.type === "application/pdf" || /\.pdf$/i.test(file?.name || "");

  return (
    <div className="flex w-full items-center justify-center">
      <Label
        htmlFor={inputId}
        className={`flex h-50 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-400 bg-gray-50 hover:bg-gray-100 ${className}`}
      >
        {!file ? (
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <RiFileUploadFill size={50} className="text-gray-300" />
            <p className="mb-2 text-sm font-semibold text-gray-800">{title}</p>
            <p className="text-xs text-gray-400">{subtitle}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pb-6 pt-5 px-2">
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="h-24 w-24 object-cover rounded shadow"
              />
            )}

            {isPDF && (
              <img
                src="/images/pdf.png"
                alt="PDF"
                className="h-24 w-24"
              />
            )}

            {!preview && !isPDF && <FaFileAlt size={50} />}

            <p className="mt-2 text-sm font-semibold text-center text-gray-800">
              {file.name}
            </p>
            <p className="text-xs text-gray-400">{subtitle}</p>
          </div>
        )}

        <FileInput
          id={inputId}              // ✅ unique per component
          ref={fileInputRef}
          className="hidden"
          {...rest}                 // ✅ spread first
          onChange={handleChange}   // ✅ then force our handler
        />
      </Label>
    </div>
  );
};

export default memo(InputFile);
