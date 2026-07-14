import os
import io
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", "eixhscje"),
    api_key=os.getenv("CLOUDINARY_API_KEY", "984542962961472"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET", "zYzt6rmnwra3FnzNvhl8AKnoeDY"),
    secure=True
)

def upload_to_cloudinary(file_data, folder="winway"):
    """
    Uploads file content (bytes, file-like object, or FastAPI UploadFile) to Cloudinary.
    Returns the secure URL of the uploaded asset, or None if it fails.
    """
    try:
        # Check if UploadFile (contains a 'file' attribute)
        if hasattr(file_data, "file"):
            if hasattr(file_data.file, "seek"):
                file_data.file.seek(0)
            file_to_upload = file_data.file
        elif isinstance(file_data, bytes):
            file_to_upload = io.BytesIO(file_data)
        else:
            file_to_upload = file_data
            
        result = cloudinary.uploader.upload(file_to_upload, folder=folder)
        return result.get("secure_url")
    except Exception as e:
        print(f"Failed to upload to Cloudinary: {e}")
        return None

def delete_from_cloudinary(url: str):
    """
    Extracts the public ID from a Cloudinary URL and deletes it from Cloudinary.
    """
    if not url or "cloudinary" not in url:
        return
    try:
        parts = url.split("/upload/")
        if len(parts) > 1:
            path_parts = parts[1].split("/")
            # Skip version tag if present (e.g., v1234567890)
            if path_parts[0].startswith('v') and path_parts[0][1:].isdigit():
                public_id_parts = path_parts[1:]
            else:
                public_id_parts = path_parts
                
            # Remove extension from the last segment
            last_part = public_id_parts[-1]
            public_id_parts[-1] = os.path.splitext(last_part)[0]
            public_id = "/".join(public_id_parts)
            
            cloudinary.uploader.destroy(public_id)
            print(f"Deleted from Cloudinary: {public_id}")
    except Exception as e:
        print(f"Failed to delete from Cloudinary: {e}")
