import axios from "axios";

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "upload");

  try {
    const uploadRes = await axios.post(
      "https://api.cloudinary.com/v1_1/dkqpzws52/image/upload",
      data
    );
    const { url } = uploadRes.data;

    return url;
  } catch (error) {
    console.log(error.message);
  }
};

export default upload;
