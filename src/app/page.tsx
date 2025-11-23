"use client";
import { useState, FormEvent } from "react";

export default function HomePage() {
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const [timeDuration, setTimeDuration] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = { link, tags, timeDuration };

    await fetch("/api/sheet-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLink("");
    setTags("");
    setTimeDuration("");
    alert("Data submitted!");
  };

  return (
    <main>
      <h1>Submit Video Entry</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Video Link:</label>
          <input value={link} onChange={(e) => setLink(e.target.value)} type="url" />
        </div>
        <div>
          <label>Tags:</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} type="text" />
        </div>
        <div>
          <label>Time Duration:</label>
          <input value={timeDuration} onChange={(e) => setTimeDuration(e.target.value)} type="text" />
        </div>
        <button type="submit">Save</button>
      </form>
    </main>
  );
}


// "use client";

// import { useState, FormEvent } from "react";

// async function getData() {
//   const res = await fetch("/api/sheet-data", {
//     cache: "no-store",
//   });
//   const data = await res.json();
//   return data.rows;
// }

// export default async function HomePage() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [message, setMessage] = useState("");

//   // const rows = await getData();

//   var rows: any[] = [];

//   const asd = function () {
//     getData().then((data) => {
//       rows = data;
//       console.log(rows);
//     });
//   }

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const form = { name, email, phone, message };

//     const response = await fetch("/api/sheet-data", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });



//     const data = await response.json();
//     alert(data.data.tableRange);

//     setName("");
//     setEmail("");
//     setPhone("");
//     setMessage("");
//   };

//   return (
//     <main>
//       <div style={{ marginTop: "200px" }}>
//         <h1>Simple Form</h1>

//         <form onSubmit={handleSubmit}>
//           <div>
//             <label>Name:</label><br />
//             <input
//               type="text"
//               value={name}
//               name="name"
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>

//           <div>
//             <label>Email:</label><br />
//             <input
//               type="email"
//               value={email}
//               name="email"
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div>
//             <label>Phone:</label><br />
//             <input
//               type="tel"
//               value={phone}
//               name="phone"
//               onChange={(e) => setPhone(e.target.value)}
//             />
//           </div>

//           <div>
//             <label>Message:</label><br />
//             <textarea
//               value={message}
//               name="message"
//               onChange={(e) => setMessage(e.target.value)}
//             ></textarea>
//           </div>

//           <button type="submit">Save</button>
//         </form>
//       </div>

//       <button onClick={() => asd()}>Fetch</button>

//       <div>
//         <h1>Google Sheet Data</h1>

//         <table cellPadding="8">
//           <tbody>
//             {rows?.map((row: any, idx: number) => (
//               <tr key={idx}>
//                 {row.map((val: string, i: number) => (
//                   <td key={i}>{val}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//     </main>
//   );
// }
