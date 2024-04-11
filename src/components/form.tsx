import {
  Avatar,
  Box,
  Button,
  Group,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { Card } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Data } from "../../constants/mocks";
import "@mantine/core/styles.css";

interface FormProps {
  handleSubmit: (values: Data) => Promise<void>;
}

export function Form({ handleSubmit }: FormProps) {
  const form = useForm<Data>({
    initialValues: {
      email: "",
      avatar: "",
      name: "",
      id: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      avatar: (value) => (value === "" ? "Avatar Url can't be empty" : null),
    },
  });

  return (
    <Card withBorder padding="lg" radius="md">
      <Box maw={340} mx="auto">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            placeholder=""
            {...form.getInputProps("name")}
          />
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
          />

          <TextInput
            withAsterisk
            label="Avatar URL"
            placeholder=""
            {...form.getInputProps("avatar")}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Box>
    </Card>
  );
}
