import { NextResponse } from "next/server";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = body?.meta?.event_name;
    const attrs = body?.data?.attributes;

    const email = attrs?.user_email;
    const productName = attrs?.product_name; // Scale / Growth
    const plan = productName?.toLowerCase(); // scale / growth

    // 1) ORDER CREATED → Just acknowledge
    if (event === "order_created") {
      return NextResponse.json({ success: true, message: "Order logged" });
    }

    // 2) SUBSCRIPTION CREATED → Activate Plan
    if (event === "subscription_created") {
      if (!email || !plan)
        return NextResponse.json({ error: "Missing subscription data" }, { status: 400 });

      const userRef = doc(db, "users", email);
      const snap = await getDoc(userRef);
      if (!snap.exists())
        return NextResponse.json({ error: "User not found" }, { status: 404 });

      await updateDoc(userRef, {
        subscriptionStatus: plan,
        subscribedAt: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, message: "Plan activated" });
    }

    // 3) SUBSCRIPTION UPDATED → Upgrade / Downgrade / Renew
    if (event === "subscription_updated") {
      if (!email || !plan)
        return NextResponse.json({ error: "Missing subscription data" }, { status: 400 });

      const userRef = doc(db, "users", email);
      await updateDoc(userRef, {
        subscriptionStatus: plan,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, message: "Plan updated" });
    }

    // 4) SUBSCRIPTION CANCELLED → Switch user to free plan
    if (event === "subscription_cancelled") {
      if (!email)
        return NextResponse.json({ error: "Missing email" }, { status: 400 });

      const userRef = doc(db, "users", email);
      await updateDoc(userRef, {
        subscriptionStatus: "free",
        cancelledAt: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, message: "Plan cancelled → Free" });
    }

    return NextResponse.json({ message: "Event ignored" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failure" }, { status: 500 });
  }
}
