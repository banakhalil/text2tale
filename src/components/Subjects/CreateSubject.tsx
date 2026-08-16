import { useRef, type FormEvent } from "react";
import { AxiosError } from "axios";
import { Button, Dialog, Field, Input, Portal } from "@chakra-ui/react";
import { useAddSubject } from "@/hooks/useSubjects";
import { toaster } from "@/components/ui/toaster";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSubject = ({ isOpen, onClose }: Props) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const addSubject = useAddSubject();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get("name")?.toString().trim() || "";
    if (!name) return;

    addSubject.mutate(name, {
      onSuccess: () => {
        toaster.create({
          title: "Subject added",
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
              ? (error.response?.data?.message ?? "Failed to add subject")
              : "Failed to add subject",
          type: "error",
          duration: 5000,
          closable: true,
        });
      },
    });
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
      initialFocusEl={() => nameRef.current}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl">
            <Dialog.Header className="drawer" borderTopRadius="2xl">
              <Dialog.Title>Add Subject</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body className="drawer">
              <form id="create-subject-form" onSubmit={handleSubmit}>
                <Field.Root>
                  <Field.Label>Name</Field.Label>
                  <Input name="name" placeholder="Subject name" ref={nameRef} />
                </Field.Root>
              </form>
            </Dialog.Body>
            <Dialog.Footer className="drawer" borderBottomRadius="2xl">
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                type="submit"
                form="create-subject-form"
                className="color-blue-solid"
                loading={addSubject.isPending}
              >
                Add
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CreateSubject;
