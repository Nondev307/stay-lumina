CREATE POLICY "Deny all select on booking_private" ON public.booking_private FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "Deny all insert on booking_private" ON public.booking_private FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "Deny all update on booking_private" ON public.booking_private FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Deny all delete on booking_private" ON public.booking_private FOR DELETE TO anon, authenticated USING (false);

CREATE POLICY "Allow read on bookings realtime topic" ON realtime.messages FOR SELECT TO anon, authenticated USING (realtime.topic() = 'bookings');