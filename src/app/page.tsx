"use client";

import Image from "next/image";
import styles from "./page.module.css";
import "@mantine/core/styles.css";
import {
  Table,
  Checkbox,
  ScrollArea,
  Group,
  Avatar,
  Text,
  rem,
} from "@mantine/core";
import { Data } from "../../constants/mocks";
import { useEffect, useState } from "react";
import axios from "axios";
import cx from "clsx";
import { Form } from "@/components/form";

export default function Home() {
  const [data, setData] = useState<Data[]>([]);
  const [selection, setSelection] = useState<string[]>([]);

  const fetchUsers = async () => {
    try {
      let response = await axios.get(
        "https://63c57732f80fabd877e93ed1.mockapi.io/api/v1/users"
      );
      if (response.status != 200) {
        throw new Error("Status code not 200");
      }
      setData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );

  const toggleAll = () =>
    setSelection((current) =>
      current.length === data.length ? [] : data.map((item) => item.id)
    );

  const handleFormSubmit = async (values: Data) => {
    try {
      const now = new Date(); // Get current date and time
      const isoTimestamp = now.toISOString();
      const sortedData = data
        .slice()
        .sort((a, b) => Number(b.id) - Number(a.id));
      const newId = Number(sortedData[0].id) + 1;
      const response = await axios.post(
        "https://63c57732f80fabd877e93ed1.mockapi.io/api/v1/users",
        {
          name: values.name,
          avatar: values.avatar,
          email: values.email,
          createdAt: isoTimestamp,
          id: newId,
        }
      );
      if (response.statusText !== "Created") {
        throw new Error("Response status not 200");
      }
      console.log(newId);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const rows = data.map((item) => {
    const selected = selection.includes(item.id);
    if (Array.isArray(item.email)) {
      item.email = item.email.join(",");
    }
    return (
      <Table.Tr
        key={item.id}
        className={cx({ [styles.rowSelected]: selected })}
      >
        <Table.Td>
          <Checkbox
            checked={selection.includes(item.id)}
            onChange={() => toggleRow(item.id)}
          ></Checkbox>
        </Table.Td>
        <Table.Td>
          <Group gap={"sm"}>
            <Avatar size={26} src={item.avatar} radius={26} />
            <Text size="sm" fw={500}>
              {item.name ? item.name : item.email.split("@")[0]}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>{item.email}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <ScrollArea className={styles.scrollArea}>
          <Table miw={800} verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: rem(40) }}>
                  <Checkbox
                    onChange={toggleAll}
                    checked={selection.length === data.length}
                    indeterminate={
                      selection.length > 0 && selection.length !== data.length
                    }
                  />
                </Table.Th>
                <Table.Th>User</Table.Th>
                <Table.Th>Email</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
        <div className={styles.formContainer}>
          <Text fw={"bolder"} ff={"heading"} p={8}>
            Create a new User
          </Text>
          <Form handleSubmit={handleFormSubmit} />
        </div>
      </div>
    </main>
  );
}
