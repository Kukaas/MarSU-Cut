import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Progress } from "antd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadIcon } from "lucide-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/firebase";
import PropTypes from "prop-types";

const ImageUpload = ({ onImageUpload, defaultImageUrl, maxSizeMB = 2 }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(defaultImageUrl || null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error("File too large!", {
          description: `File should not exceed ${maxSizeMB}MB.`,
          action: { label: "Ok" },
        });
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImageFileUrl(imageUrl);
    }
  };

  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.error("Image upload error:", error);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          onImageUpload(downloadURL); // Pass the uploaded image URL to the parent component
        });
      }
    );
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  return (
    <div className="space-y-2">
      <div className="flex items-center relative justify-between">
        {imageFileUrl ? (
          <img
            src={imageFileUrl}
            alt="uploaded"
            className="h-8 w-8 absolute ml-5"
          />
        ) : (
          <UploadIcon className="h-5 w-5 absolute ml-5" />
        )}
        <Button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="w-full flex justify-start"
          variant="outline"
        >
          <span className="truncate ml-12">
            {imageFile ? imageFile.name.slice(0, 20) + "..." : "Upload image"}
          </span>
        </Button>
      </div>
      <Input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageChange}
        accept="image/*"
      />
      <div className="flex flex-col">
        <p className="text-sm text-red-500 mt-2">
          <i>Note: Wait for the upload to reach 100%</i>
        </p>
        <Progress
          percent={progress}
          status="active"
          strokeColor={{
            from: "#108ee9",
            to: "#87d068",
          }}
          format={(percent) => (
            <span className="dark:text-white">{percent}%</span>
          )}
        />
      </div>
    </div>
  );
};

ImageUpload.propTypes = {
  onImageUpload: PropTypes.func.isRequired, // Callback for the uploaded image URL
  defaultImageUrl: PropTypes.string, // Default image URL (optional)
  maxSizeMB: PropTypes.number, // Maximum file size in MB (default: 2MB)
};

export default ImageUpload;
