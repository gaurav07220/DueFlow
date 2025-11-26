import { NextResponse } from "next/server";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const event = body?.meta?.event_name;
    if (!event) return NextResponse.json({ error: "Invalid event" }, { status: 400 });

    const email = body?.data?.attributes?.user_email;
    const plan = body?.data?.attributes?.product_name; // Growth / Scale / etc

    if (!email || !plan)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // Firebase — find user by email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userDoc = snapshot.docs[0];
    const userRef = doc(db, "users", userDoc.id);

    // Update user subscription
    await updateDoc(userRef, {
      subscriptionStatus: plan.toLowerCase(), // growth / scale
      subscribedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Subscription updated" }, { status: 200 });

  } catch (error) {
    console.error("Webhook error: ", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
