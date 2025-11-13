import React, { useMemo, useRef } from "react";
import PublishedRoomCard from "./PublishedRoomCard";
import useDragScrollX from "../../hooks/useDragScrollX";
import "./landlord-dashboard.css";

const mk = (id, {title, imgUrl, status="available", tenant}) => ({
  id,
  title,
  location: "Indiranagar, Bengaluru",
  description:
    "Lorem ipsum dolor sit amet consectetur. Aliquet accumsan sed vestibulum vestibulum cras tempus.",
  avatars: [
    { src: "https://i.pravatar.cc/64?img=15", alt: "user" },
    { src: "https://i.pravatar.cc/64?img=36", alt: "user" },
  ],
  contactName: "Amitabh bachan",
  lookingFor: "Flatmate",
  subletDuration: "1–6 Months",
  rentLabel: "₹ 12000",
  prefGender: "Male",
  prefOther: "No",
  imgUrl,
  status,
  tenant,   // undefined nếu chưa có
});

const FALLBACK_ROOMS = [
  mk("r1", { title:"3BHK", imgUrl:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop" }),
  mk("r2", { title:"2BHK", imgUrl:"https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop" }),
  mk("r3", { title:"Studio", imgUrl:"https://images.unsplash.com/photo-1512918717608-632f1f1a3b67?q=80&w=1600&auto=format&fit=crop",
             status:"rented", tenant:{ name:"Nguyen Minh Khoa", avatar:"https://i.pravatar.cc/64?img=11" } }),
  mk("r4", { title:"1BR", imgUrl:"https://images.unsplash.com/photo-1586105251261-72a756497a12?q=80&w=1600&auto=format&fit=crop" }),
  mk("r5", { title:"Loft", imgUrl:"https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop" }),
  mk("r6", { title:"3BHK", imgUrl:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop",
             status:"rented", tenant:{ name:"Tran Bao Anh", avatar:"https://i.pravatar.cc/64?img=21" } }),
];

export default function LandlordPublished({ title = "My Published Rooms", rooms }) {
  const scrollRef = useRef(null);
  useDragScrollX(scrollRef);    

  const list = useMemo(
    () => (rooms && rooms.length ? rooms : FALLBACK_ROOMS).slice(0, 6),
    [rooms]
  );

  console.table(
    list.map(({ id, title, status, tenant }) => ({
        id, title, status, hasTenant: !!tenant, tenantName: tenant?.name ?? null
    }))
    );

  return (
    <section className="ldb-panel">
      <h2 className="ldb-h2">🏠 {title}</h2>
      <hr className="ldb-sep" />
      <div ref={scrollRef} className="ldb-hscroll drag">
        {list.map((r) => (
          <div key={r.id} className="ldb-item">
            <PublishedRoomCard {...r} />
          </div>
        ))}
      </div>
    </section>
  );
}
