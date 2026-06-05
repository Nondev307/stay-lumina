import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash, randomUUID } from "crypto";

const bookSchema = z.object({
  room_number: z.string().min(2).max(8).regex(/^[0-9]+$/),
  nickname: z.string().trim().min(1).max(40),
  phone: z.string().trim().min(6).max(20).regex(/^[0-9+\-\s()]+$/),
});

const cancelSchema = z.object({
  room_number: z.string().min(2).max(8).regex(/^[0-9]+$/),
  secret: z.string().min(10).max(80),
});

function hashSecret(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

export const bookRoom = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await supabaseAdmin
      .from("bookings")
      .select("id")
      .eq("room_number", data.room_number)
      .maybeSingle();

    if (existing) {
      throw new Error("ห้องนี้ถูกจองไปแล้ว");
    }

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("bookings")
      .insert({ room_number: data.room_number, nickname: data.nickname })
      .select("id")
      .single();

    if (insertError || !inserted) {
      throw new Error(insertError?.message ?? "ไม่สามารถจองห้องได้");
    }

    const secret = randomUUID();
    const { error: privateError } = await supabaseAdmin
      .from("booking_private")
      .insert({
        booking_id: inserted.id,
        phone: data.phone,
        secret_hash: hashSecret(secret),
      });

    if (privateError) {
      await supabaseAdmin.from("bookings").delete().eq("id", inserted.id);
      throw new Error(privateError.message);
    }

    return { success: true as const, secret, room_number: data.room_number };
  });

export const cancelBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => cancelSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: booking } = await supabaseAdmin
      .from("bookings")
      .select("id")
      .eq("room_number", data.room_number)
      .maybeSingle();

    if (!booking) {
      throw new Error("ไม่พบการจองห้องนี้");
    }

    const { data: priv } = await supabaseAdmin
      .from("booking_private")
      .select("secret_hash")
      .eq("booking_id", booking.id)
      .maybeSingle();

    if (!priv || priv.secret_hash !== hashSecret(data.secret)) {
      throw new Error("รหัสยกเลิกไม่ถูกต้อง คุณไม่มีสิทธิ์ยกเลิกการจองนี้");
    }

    const { error } = await supabaseAdmin.from("bookings").delete().eq("id", booking.id);
    if (error) throw new Error(error.message);

    return { success: true as const };
  });
