export interface Track {
  id: string; // YouTube video id — official / artist "Topic" uploads, all verified embeddable
  title: string;
  subtitle: string;
}

export const artist = {
  name: "Samar Jafri",
  channel: "https://www.youtube.com/@Samar_Jafri",
};

// Khaab first, as requested. Replace / add YouTube ids to customise the playlist.
export const tracks: Track[] = [
  { id: "gjfuGRZ3-Ig", title: "Khaab", subtitle: "Single" },
  { id: "XwdjRI7S16I", title: "Meri Ho", subtitle: "Official Video" },
  { id: "4Jmeg6nK0Y8", title: "Hoor", subtitle: "Official Video" },
  { id: "EK8IdWyztLo", title: "Main Rahun", subtitle: "Parwarish OST" },
  { id: "EqXzAmBGDhw", title: "Kaash", subtitle: "with RAAMIS" },
  { id: "NMQFUxhGuXw", title: "Sadaayein", subtitle: "Raja London Ka OST" },
  { id: "ViCb3tczD0g", title: "Guzaarishein", subtitle: "Parwarish OST · with Alistair Alvin" },
  { id: "piyLXuSrDYo", title: "Chalo Door Kahin", subtitle: "Official Video" },
  { id: "LGrep_5t6OY", title: "Har Baar", subtitle: "Sufi-Pop Ballad" },
  { id: "UZO43Zedx94", title: "Chalo Door Kahin", subtitle: "Reprise" },
];

export const cover = (id: string, quality: "hq" | "mq" = "hq") =>
  `https://i.ytimg.com/vi/${id}/${quality}default.jpg`;

export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
