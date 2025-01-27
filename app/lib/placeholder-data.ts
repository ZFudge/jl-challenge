const users = [
  {
    id: "a2446a6b-4cef-5589-1724-10042b445014",
    name: "TestUser",
    email: "testuser@test.com",
    password: "pw12345",
  },
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "Joe Average",
    email: "joe@business1.com",
    password: "pw12345",
  },
  {
    id: "42719855-fec4-b6a6-442a-410544b24001",
    name: "Ruttiger Timey",
    email: "rtimey@business2.com",
    password: "pw12345",
  },
];

const publishers = [
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
    name: "Sports Blog",
    email: "contact@sportsblog.com",
    domain: "sportsblog.com",
    image_url: "/publishers/evil-rabbit.png",
  },
  {
    id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
    name: "Tech News",
    email: "contact@technews.com",
    domain: "technews.com",
    image_url: "/publishers/delba-de-oliveira.png",
  },
  {
    id: "3958dc9e-742f-4377-85e9-fec4b6a6442a",
    name: "Fake News",
    email: "contact@fakenews.com",
    domain: "fakenews.com",
    image_url: "/publishers/lee-robinson.png",
  },
  {
    id: "76d65c26-f784-44a2-ac19-586678f7c2f2",
    name: "Health Blog",
    email: "contact@healthblog.com",
    domain: "healthblog.com",
    image_url: "/publishers/michael-novotny.png",
  },
  {
    id: "CC27C14A-0ACF-4F4A-A6C9-D45682C144B9",
    name: "Music Stuff",
    email: "contact@musicstuff.com",
    domain: "musicstuff.com",
    image_url: "/publishers/amy-burns.png",
  },
  {
    id: "13D07535-C59E-4157-A011-F8D2EF4E0CBB",
    name: "Code Book",
    email: "contact@codebook.com",
    domain: "codebook.com",
    image_url: "/publishers/balazs-orban.png",
  },
];

type Campaign = {
  publisher_id: string;
  owner_id: string;
  budget: number;
  name: string;
  status: "active" | "pending" | "archived" | "paused";
  date: string;
  gender?: string;
  age?: string;
  devices?: string;
  geo?: string;
};

const campaigns: Campaign[] = [
  {
    publisher_id: publishers[0].id,
    owner_id: "410544b2-4001-4271-9855-fec4b6a6442a",
    budget: 15795,
    name: "Sports Campaign",
    status: "pending",
    date: "2022-12-06",
  },
  {
    publisher_id: publishers[1].id,
    owner_id: "410544b2-4001-4271-9855-fec4b6a6442a",
    budget: 20348,
    name: "Tech Campaign",
    status: "pending",
    date: "2022-11-14",
  },
  {
    publisher_id: publishers[4].id,
    owner_id: "410544b2-4001-4271-9855-fec4b6a6442a",
    budget: 3040,
    name: "Music Campaign",
    status: "active",
    date: "2022-10-29",
  },
  {
    publisher_id: publishers[3].id,
    owner_id: "410544b2-4001-4271-9855-fec4b6a6442a",
    budget: 44800,
    name: "Health Campaign",
    status: "active",
    date: "2023-09-10",
  },
  {
    publisher_id: publishers[5].id,
    owner_id: "410544b2-4001-4271-9855-fec4b6a6442a",
    budget: 34577,
    name: "Code Campaign",
    status: "pending",
    date: "2023-08-05",
  },
  {
    publisher_id: publishers[2].id,
    owner_id: "410544b2-4001-4271-9855-fec4b6a6442a",
    budget: 54246,
    name: "Test Campaign",
    status: "pending",
    date: "2023-07-16",
  },
  {
    publisher_id: publishers[0].id,
    owner_id: "410544b2-4001-4271-9855-fec4b6a6442a",
    budget: 666,
    name: "Sports Campaign II",
    status: "pending",
    date: "2023-06-27",
  },
  {
    publisher_id: publishers[3].id,
    owner_id: "410544b2-4001-4271-9855-fec4b6a6442a",
    budget: 32545,
    name: "Science Campaign",
    status: "active",
    date: "2023-06-09",
  },
  {
    publisher_id: publishers[4].id,
    owner_id: "410544b2-4001-4271-9855-fec4b6a6442a",
    budget: 1250,
    name: "Books Campaign",
    status: "active",
    date: "2023-06-17",
  },
  {
    publisher_id: publishers[5].id,
    owner_id: "a2446a6b-4cef-5589-1724-10042b445014",
    budget: 8546,
    name: "Test Campaign II",
    status: "active",
    date: "2023-06-07",
  },
  {
    publisher_id: publishers[1].id,
    owner_id: "a2446a6b-4cef-5589-1724-10042b445014",
    budget: 500,
    name: "Tech Campaign II",
    status: "active",
    date: "2023-08-19",
  },
  {
    publisher_id: publishers[5].id,
    owner_id: "a2446a6b-4cef-5589-1724-10042b445014",
    budget: 8945,
    name: "Music Campaign II",
    status: "active",
    date: "2023-06-03",
  },
  {
    publisher_id: publishers[2].id,
    owner_id: "a2446a6b-4cef-5589-1724-10042b445014",
    budget: 1000,
    name: "Test Campaign III",
    status: "active",
    date: "2022-06-05",
  },
];

const devices = [
  { name: "Desktop", id: "af41f1b3-3379-f623-5499-302f3ed0cbfa" },
  { name: "Tablet", id: "fbe15818-06e0-3672-2a0b-174747420992" },
  { name: "Mobile", id: "ed233df4-d7f8-a5f3-4cd6-cadb85deab7a" },
  { name: "CTV", id: "80d0062c-db04-26e2-57b6-0397e1510adc" },
  { name: "Set Top Box", id: "3e32ebf5-b256-fb6a-3a64-6a4e52ff2bac" },
];

const spend = [
  { month: "Jan", spend: 2000 },
  { month: "Feb", spend: 1800 },
  { month: "Mar", spend: 2200 },
  { month: "Apr", spend: 2500 },
  { month: "May", spend: 2300 },
  { month: "Jun", spend: 3200 },
  { month: "Jul", spend: 3500 },
  { month: "Aug", spend: 3700 },
  { month: "Sep", spend: 2500 },
  { month: "Oct", spend: 2800 },
  { month: "Nov", spend: 3000 },
  { month: "Dec", spend: 4800 },
];

export {
  users,
  publishers,
  campaigns,
  spend,
  devices,
};
