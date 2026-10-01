export interface ChecklistTemplateGroup {
  title: string;
  icon: string;
  items: string[];
}

export const defaultChecklist: ChecklistTemplateGroup[] = [
  {
    title: "Before trip",
    icon: "list-checks",

    items: [
      "Online check-in",
      "Download offline maps",
      "Check mobile roaming",
      "Notify bank",
    ],
  },

  {
    title: "Documents",
    icon: "file-text",

    items: [
      "Passport",
      "Travel insurance",
      "Flight or train tickets",
      "Hotel reservation",
    ],
  },

  {
    title: "Electronics",
    icon: "plug",

    items: ["Phone", "Charger", "Power bank", "Headphones", "Travel adapter"],
  },

  {
    title: "Clothes",
    icon: "shirt",

    items: ["T-shirts", "Underwear", "Socks", "Comfortable shoes"],
  },
];
