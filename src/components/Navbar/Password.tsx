import {
  Button,
  CloseButton,
  Drawer,
  Field,
  Fieldset,
  Portal,
  Text,
  Input,
} from "@chakra-ui/react";
import { useState, type FormEvent } from "react";
import { toaster } from "../ui/toaster";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  old_password?: string;
  new_password?: string;
  confirm_new_password?: string;
}

const Password = ({ isOpen, onClose }: Props) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const validateForm = (data: {
    old_password: string;
    new_password: string;
    confirm_new_password: string;
  }): boolean => {
    const newErrors: FormErrors = {};

    if (!data.old_password) {
      newErrors.old_password = "Current password is required";
    }

    if (!data.new_password) {
      newErrors.new_password = "New password is required";
    } else if (data.new_password.length < 8) {
      newErrors.new_password = "New password must be at least 8 characters";
    }

    if (!data.confirm_new_password) {
      newErrors.confirm_new_password = "Please confirm your new password";
    } else if (data.confirm_new_password !== data.new_password) {
      newErrors.confirm_new_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      old_password: formData.get("old_password")?.toString() || "",
      new_password: formData.get("new_password")?.toString() || "",
      confirm_new_password:
        formData.get("confirm_new_password")?.toString() || "",
    };

    if (!validateForm(data)) return;

    setIsSaving(true);
    // TEMP: no real change-password endpoint wired yet — just confirms client-side validation.
    toaster.create({
      title: "Password changed",
      type: "success",
      duration: 3000,
      closable: true,
    });
    form.reset();
    setErrors({});
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
              <Drawer.Title>Change Password</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Fieldset.Root size="lg" maxW="md" marginTop="20px">
                <form onSubmit={handleSubmit}>
                  <Fieldset.Content gap={4}>
                    <Field.Root>
                      <Field.Label>Current Password</Field.Label>
                      <Input
                        name="old_password"
                        type="password"
                        placeholder="Enter current password"
                      />
                      {errors.old_password && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.old_password}
                        </Text>
                      )}
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>New Password</Field.Label>
                      <Input
                        name="new_password"
                        type="password"
                        placeholder="Enter new password"
                      />
                      {errors.new_password && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.new_password}
                        </Text>
                      )}
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Confirm Password</Field.Label>
                      <Input
                        name="confirm_new_password"
                        type="password"
                        placeholder="Confirm new password"
                      />
                      {errors.confirm_new_password && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.confirm_new_password}
                        </Text>
                      )}
                    </Field.Root>
                  </Fieldset.Content>

                  <Button type="submit" my={6} loading={isSaving}>
                    Change Password
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

export default Password;
