import { TaskResponse } from "@/types";

const url = `${process.env.MERGENT_API_URL}/tasks`;

export const createTask = async (body: string) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MERGENT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body,
  };

  const res = await fetch(url, options);

  return await res.json();
};
export const updateTask = async (id: string, body: string) => {
  const options = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.MERGENT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body,
  };

  const res = await fetch(`${url}/${id}`, options);
  return await res.json();
};

export const runTask = async (id: string) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MERGENT_API_KEY}`,
    },
  };

  const res = await fetch(`${url}/${id}/run`, options);
  return (await res.json()) as TaskResponse;
};
export const deleteTask = async (id: string) => {
  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${process.env.MERGENT_API_KEY}`,
    },
  };

  const res = await fetch(`${url}/${id}`, options);
  // Check if the response has a body
  if (res.headers.get("Content-Length") === "0" || res.status === 204) {
    // No content, return something else or just return
    return {}; // or return null or empty string depending on your use case
  }
};

export const deleteManyTask = async (body: string) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MERGENT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body,
  };

  const res = await fetch(`${url}/batch-delete`, options);

  // Check if the response has a body
  if (res.headers.get("Content-Length") === "0" || res.status === 204) {
    // No content, return something else or just return
    return {}; // or return null or empty string depending on your use case
  }

  return await res.json();
};

export const getTaskById = async (id: string) => {
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.MERGENT_API_KEY}` },
  };

  try {
    const res = await fetch(`${url}/${id}`, options);
    return (await res.json()) as TaskResponse;
  } catch (error) {
    return null;
  }
};
export const getTasks = async () => {
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.MERGENT_API_KEY}` },
  };
  try {
    const res = await fetch(url, {
      ...options,
      next: {
        tags: ["tasks"],
        revalidate: 10,
      },
    });
    return (await res.json()) as TaskResponse[];
  } catch (error) {
    return [];
  }
};
