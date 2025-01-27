export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Publisher = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Status = "pending" | "active" | "archived" | "paused";

export type Campaign = {
  id: string;
  publisher_id: string;
  budget: number;
  date: string;
  status: Status;
};

export type Spend = {
  month: string;
  spend: number;
};

export type LatestCampaign = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  budget: string;
};

// The database returns a number for budget, but we later format it to a string with the formatCurrency function
export type LatestCampaignRaw = Omit<LatestCampaign, "budget"> & {
  budget: number;
};

export type CampaignsTable = {
  id: string;
  publisher_id: string;
  name: string;
  publishername: string;
  email: string;
  image_url: string;
  date: string;
  budget: number;
  status: Status;
};

export type PublishersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_campaigns: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedPublishersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_campaigns: number;
  total_pending: string;
  total_paid: string;
};

export type PublisherField = {
  id: string;
  name: string;
};

export type CampaignForm = {
  id: string;
  name: string;
  publisher_id: string;
  budget: number;
  gender: string;
  age: string;
  devices: string;
  geo: string;
};

export type Breadcrumb = {
  label: string;
  href: string;
  active?: boolean;
};
