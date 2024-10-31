import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import {
  createStaff,
  deleteStaff,
  updateStaff,
  upsertStaff,
} from "@/services/staffs";
import { StaffRole } from "@prisma/client";
import { deleteMessagesByOrgId } from "@/services/messages";
import { updateFieldOrgWhenOrgDeleted } from "@/services/fields";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  if (evt.type === "user.created") {
    const role = evt.data.public_metadata?.role;
    const user = evt.data;
    const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();
    const email = user.email_addresses[0].email_address;
    if (!role) {
      return new Response("", { status: 200 });
    }

    await createStaff(user.id, {
      email,
      name,
      imageUrl: user.image_url,
      role: role as StaffRole,
    });
  }
  if (evt.type === "user.updated") {
    const user = evt.data;
    const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();
    const role = evt.data.public_metadata?.role;

    if (!role) {
      await updateStaff(user.id, {
        imageUrl: user.image_url,
        name,
      });
    } else {
      await upsertStaff(user.id, {
        email: user.email_addresses[0].email_address,
        name,
        role: role as StaffRole,
        imageUrl: user.image_url,
      });
    }
  }

  if (evt.type === "user.deleted") {
    const id = evt.data.id;
    if (id) {
      await deleteStaff(id);
    }
  }
  if (evt.type === "organization.deleted") {
    const id = evt.data.id;
    if (id) {
      await deleteMessagesByOrgId(id);
      await updateFieldOrgWhenOrgDeleted(id);
    }
  }
  return new Response("", { status: 200 });
}
