import {
  Button,
  CloseButton,
  Drawer,
  Field,
  Fieldset,
  Portal,
  Input,
  Avatar,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { HiUpload } from "react-icons/hi";
import { AxiosError } from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { toaster } from "../ui/toaster";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSkeleton = () => (
  <VStack gap="6" align="stretch" maxW="md">
    <SkeletonCircle
      size="120px"
      alignSelf="center"
      bgColor="gray.300"
      _dark={{ bgColor: "gray.800" }}
    />
    <Skeleton
      height="32px"
      width="150px"
      alignSelf="center"
      bgColor="gray.300"
      _dark={{ bgColor: "gray.800" }}
    />
    {Array.from({ length: 5 }).map((_, i) => (
      <VStack key={i} align="stretch" gap="2">
        <SkeletonText
          noOfLines={1}
          width="30%"
          bgColor="gray.300"
          _dark={{ bgColor: "gray.800" }}
        />
        <Skeleton
          height="40px"
          bgColor="gray.300"
          _dark={{ bgColor: "gray.800" }}
        />
      </VStack>
    ))}
  </VStack>
);

const Profile = ({ isOpen, onClose }: Props) => {
  const { updateUser } = useAuth();
  const { data: user, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    updateProfile.mutate(
      {
        first_name: formData.get("first_name")?.toString() || undefined,
        last_name: formData.get("last_name")?.toString() || undefined,
        email: formData.get("email")?.toString() || undefined,
        profile_image: imageFile ?? undefined,
      },
      {
        onSuccess: (updated) => {
          updateUser(updated);
          toaster.create({
            title: "Profile updated",
            type: "success",
            duration: 3000,
            closable: true,
          });
          onClose();
        },
        onError: (error) => {
          toaster.create({
            title: "Error",
            description:
              error instanceof AxiosError
                ? (error.response?.data?.message ?? "Failed to update profile")
                : "Failed to update profile",
            type: "error",
            duration: 5000,
            closable: true,
          });
        },
      },
    );
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={() => onClose()} size="sm">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>My Profile</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              {isLoading ? (
                <ProfileSkeleton />
              ) : (
                <Fieldset.Root size="lg" maxW="md">
                  <form onSubmit={handleSubmit}>
                    <Fieldset.Content gap={4}>
                      <Avatar.Root
                        width="120px"
                        height="120px"
                        alignSelf="center"
                      >
                        <Avatar.Fallback
                          name={
                            `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
                            user?.email
                          }
                          fontSize="2xl"
                        />
                        {(imagePreview || user?.profile_image) && (
                          <Avatar.Image
                            src={imagePreview ?? user?.profile_image}
                            loading="eager"
                          />
                        )}
                      </Avatar.Root>
                      <Field.Root alignItems="center">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <HiUpload /> Change Avatar
                        </Button>
                      </Field.Root>

                      <Field.Root>
                        <Field.Label>First Name</Field.Label>
                        <Input
                          name="first_name"
                          defaultValue={user?.first_name}
                        />
                      </Field.Root>

                      <Field.Root>
                        <Field.Label>Last Name</Field.Label>
                        <Input
                          name="last_name"
                          defaultValue={user?.last_name}
                        />
                      </Field.Root>

                      <Field.Root>
                        <Field.Label>Email</Field.Label>
                        <Input
                          name="email"
                          type="email"
                          defaultValue={user?.email}
                        />
                      </Field.Root>

                      <Field.Root disabled>
                        <Field.Label>Role</Field.Label>
                        <Input disabled value={user?.role ?? ""} />
                      </Field.Root>

                      {/* <Field.Root disabled>
                        <Field.Label>Security Code</Field.Label>
                        <Input disabled value={user?.securityCode ?? ""} />
                      </Field.Root> */}
                    </Fieldset.Content>

                    <Button
                      type="submit"
                      my={6}
                      loading={updateProfile.isPending}
                    >
                      Update
                    </Button>
                  </form>
                </Fieldset.Root>
              )}
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default Profile;
