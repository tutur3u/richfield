// "Community & Impact" — three programs through which Richfield's care extends
// beyond the workplace. Verbatim from the final content doc.
export type CommunityProgram = {
  title: string;
  body: string;
  photo: string;
  videoUrl?: string;
};

export const communityIntro = "Richfield's care extends beyond the workplace.";

export const communityPrograms: CommunityProgram[] = [
  {
    title: "Education & Youth",
    body: "Scholarship programs, school supply donations, and support for orphanages and struggling families — including 400+ gifts distributed to disadvantaged students and families during a 2024 Dak Lak initiative.",
    photo: "/photos/community/charity.webp",
  },
  {
    title: "Cultural Preservation",
    body: "Co-Chairwoman Phùng Thị Thu Thủy is a passionate champion of the Vietnamese áo dài as a symbol of national heritage. This commitment to Vietnamese cultural identity is woven into how the company presents itself at every major event.",
    photo: "/photos/community/ao-dai.webp",
    videoUrl: "https://www.youtube.com/watch?v=ZTd2L_xhYt8",
  },
  {
    title: "Employee Programs",
    body: "Team sports, beach volleyball, cycling activities, internal talent competitions, gala dinners, and 30 years of welfare programs that support employees and their families.",
    photo: "/photos/community/employee-programs.webp",
  },
];
