import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../Hook/useAuth";
import useAxios from "../../Hook/useAxios";

const UserProfile = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Profile data fetch
  const {
    data: profile,
    isLoading,
    isError,
  } = useAxios("get", `/users/${user?.email}`);

  // PATCH profile
  const updateProfile = useAxios(
    "patch",
    `/users/${user?.email}`,
    {},
    {
      invalidateQueries: [`/users/${user?.email}`],
    }
  );

  // Local state for uploaded image URL and loading
  const [imgUrl, setImgUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fill form when profile loads, also prefill imgUrl
  useEffect(() => {
    if (profile) {
      reset({
        name: profile?.name || "",
        phone: profile?.phone || "",
        address: profile?.address || "",
      });
      setImgUrl(profile?.photoURL || user?.photoURL || "");
    }
  }, [profile, reset, user]);

  // Upload to imgbb
  const uploadImageToImgbb = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const apiKey = import.meta.env.VITE_IMGBB_KEY;
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.success) {
        setImgUrl(data.data.url);
      } else {
        alert("Image upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadImageToImgbb(file);
  };

  // On form submit include imgUrl (uploaded photo URL)
  const onSubmit = (data) => {
    const payload = {
      ...data,
      photoURL: imgUrl,
    };

    // Remove empty fields (optional)
    Object.keys(payload).forEach((key) => {
      if (payload[key] === "") delete payload[key];
    });

    updateProfile.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">
        Failed to load profile
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Card */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body items-center text-center">
          <div className="avatar mb-4">
            <div className="w-28 h-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
              {imgUrl ? (
                <img src={imgUrl} alt="User Avatar" />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                  No Image
                </div>
              )}
            </div>
          </div>

          <h2 className="card-title text-2xl">
            {profile?.name || user?.displayName}
          </h2>

          <p className="text-gray-500">{user?.email}</p>

          <div className="badge badge-primary mt-2">
            {profile?.role || "user"}
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="text-xl font-semibold mb-4">
            Edit Profile
          </h3>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  Name is required
                </span>
              )}
            </div>

            {/* Phone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                {...register("phone")}
              />
            </div>

            {/* Photo Upload */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Profile Image</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {uploading && (
                <span className="text-sm text-blue-500 mt-1">
                  Uploading image...
                </span>
              )}
            </div>

            {/* Address */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                {...register("address")}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                className="btn btn-primary w-full"
                disabled={updateProfile.isPending || uploading}
              >
                {updateProfile.isPending
                  ? "Updating..."
                  : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
