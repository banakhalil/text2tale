import {
  Button,
  CloseButton,
  Drawer,
  Field,
  Fieldset,
  Portal,
  Input,
  Avatar,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { HiUpload } from "react-icons/hi";
import { useAuth } from "@/contexts/AuthContext";
import { toaster } from "../ui/toaster";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Profile = ({ isOpen, onClose }: Props) => {
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    // TEMP: updates local state only until a real profile-update endpoint exists.
    updateUser({
      first_name: formData.get("first_name")?.toString() || user.first_name,
      last_name: formData.get("last_name")?.toString() || user.last_name,
      email: formData.get("email")?.toString() || user.email,
      profile_image: imagePreview ?? user.profile_image,
    });

    toaster.create({
      title: "Profile updated",
      type: "success",
      duration: 3000,
      closable: true,
    });
    setIsSaving(false);
    onClose();
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
              <Fieldset.Root size="lg" maxW="md">
                <form onSubmit={handleSubmit}>
                  <Fieldset.Content gap={4}>
                    <Avatar.Root width="120px" height="120px" alignSelf="center">
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
                      <Input name="first_name" defaultValue={user?.first_name} />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Last Name</Field.Label>
                      <Input name="last_name" defaultValue={user?.last_name} />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Email</Field.Label>
                      <Input name="email" type="email" defaultValue={user?.email} />
                    </Field.Root>

                    <Field.Root disabled>
                      <Field.Label>Role</Field.Label>
                      <Input disabled value={user?.role ?? ""} />
                    </Field.Root>

                    <Field.Root disabled>
                      <Field.Label>Security Code</Field.Label>
                      <Input disabled value={user?.securityCode ?? ""} />
                    </Field.Root>
                  </Fieldset.Content>

                  <Button type="submit" my={6} loading={isSaving}>
                    Update
                  </Button>
                </form>
              </Fieldset.Root>
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
