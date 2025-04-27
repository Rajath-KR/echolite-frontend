import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { X, Camera } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ProfileFormData {
  fullname: string;
  username: string;
  mobilenumber: string;
  bio: string;
  gender: string;
  dateofbirth: string;
  location: string;
}

interface ProfileDetailsType {
  _id: string;
  fullname: string;
  username: string;
  mobilenumber: string;
  bio: string;
  gender: string;
  dateofbirth: string;
  location: string;
  profileImg?: string;
}

interface ProfileFormProps {
  isEditing: boolean;
  profileId: string;
  initialData?: ProfileDetailsType;
  onCancel: () => void;
  onSubmissionResult: (success: boolean, message: string) => void;
  imageVersion: number;
}

const ProfileForm = ({
  isEditing,
  profileId,
  initialData,
  onCancel,
  onSubmissionResult,
  imageVersion,
}: ProfileFormProps) => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    defaultValues: {
      fullname: '',
      username: '',
      mobilenumber: '',
      bio: '',
      gender: '',
      dateofbirth: '',
      location: '',
    },
  });

  useEffect(() => {
    if (isEditing && initialData) {
      const formattedDate = initialData.dateofbirth
        ? new Date(initialData.dateofbirth).toISOString().split('T')[0]
        : '';

      form.reset({
        fullname: initialData.fullname || '',
        username: initialData.username || '',
        mobilenumber: initialData.mobilenumber || '',
        bio: initialData.bio || '',
        gender: initialData.gender || '',
        dateofbirth: formattedDate || '',
        location: initialData.location || '',
      });

      if (initialData.profileImg) {
        setImagePreview(
          `http://localhost:8000/Images/${initialData.profileImg}?v=${imageVersion}`,
        );
      } else {
        setImagePreview(null);
      }
      setRemoveCurrentImage(false);
    } else {
      form.reset({
        fullname: '',
        username: '',
        mobilenumber: '',
        bio: '',
        gender: '',
        dateofbirth: '',
        location: '',
      });
      setImagePreview(null);
      setProfileImage(null);
      setRemoveCurrentImage(false);
    }
  }, [isEditing, initialData, form, imageVersion]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setRemoveCurrentImage(false);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    setRemoveCurrentImage(true);
  };

  const handleCreateProfile = async (data: ProfileFormData) => {
    try {
      setUploadingImage(true);
      setSubmissionError(null);

      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value?.toString() || '');
      });

      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      console.log('Creating profile with data:', Object.fromEntries(formData));

      const response = await fetch('http://localhost:8000/profile', {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Error: ${response.status}`);
      }

      console.log('Profile created successfully:', responseData);
      onSubmissionResult(true, 'Profile created successfully');
      form.reset();
      setProfileImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error creating profile:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create profile';
      setSubmissionError(errorMessage);
      onSubmissionResult(false, errorMessage);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProfile = async (data: ProfileFormData) => {
    try {
      setUploadingImage(true);
      setSubmissionError(null);

      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value?.toString() || '');
      });

      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      if (removeCurrentImage) {
        formData.append('removeImage', 'true');
      }

      console.log('Updating profile with ID:', profileId);
      console.log('Update data:', Object.fromEntries(formData));

      const response = await fetch(
        `http://localhost:8000/profile/${profileId}`,
        {
          method: 'PUT',
          body: formData,
        },
      );

      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        responseData = { message: text };
      }

      if (!response.ok) {
        throw new Error(responseData.message || `Error: ${response.status}`);
      }

      console.log('Profile updated successfully:', responseData);
      onSubmissionResult(true, 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update profile';
      setSubmissionError(errorMessage);
      onSubmissionResult(false, errorMessage);
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    console.log('Form submitted with data:', data);
    if (isEditing) {
      handleUpdateProfile(data);
    } else {
      handleCreateProfile(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {submissionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {submissionError}
          </div>
        )}

        <div className="flex justify-center mb-6">
          <div className="relative">
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="rounded-full object-cover w-20 h-20 border-4 border-gray-200"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 rounded-full h-6 w-6"
                  onClick={removeImage}
                >
                  <X size={14} />
                </Button>
              </div>
            ) : (
              <div className="bg-gray-200 rounded-full w-32 h-32 flex items-center justify-center">
                <Camera size={32} className="text-gray-400" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullname"
            rules={{ required: 'Full name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            rules={{ required: 'Username is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="mobilenumber"
            rules={{
              required: 'Mobile number is required',
              pattern: {
                value: /^\d{10}$/,
                message: 'Please enter a valid 10-digit mobile number',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Mobile Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Mobile Number"
                    {...field}
                    maxLength={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Bio" {...field} className="" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gender"
            rules={{ required: 'Gender is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value || initialData?.gender || ''}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateofbirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=""> Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Location</FormLabel>
                <FormControl>
                  <Input placeholder="Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel className="">Profile Image</FormLabel>
            <FormControl>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="flex-1"
                />
                {(imagePreview || removeCurrentImage) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeImage}
                    className="bg-transparent"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </FormControl>
          </FormItem>
        </div>
        <Separator />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              onCancel();
              setImagePreview(null);
              setProfileImage(null);
            }}
            className="h-8 text-sm bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={uploadingImage}
            className="h-8 text-sm"
          >
            {uploadingImage ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : isEditing ? (
              'Update Profile'
            ) : (
              'Create Profile'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
