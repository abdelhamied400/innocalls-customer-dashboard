export type Digit = {
  number: string;
  alt: string;
  value: string;
  long: string;
  tone: string;
};

export const digits = [
  {
    number: "1",
    value: "1",
    alt: "",
    long: "",
    tone: "/sound/dtmf-1.mp3",
  },
  {
    number: "2",
    value: "2",
    alt: "ABC",
    long: "",
    tone: "/sound/dtmf-2.mp3",
  },
  {
    number: "3",
    value: "3",
    alt: "DEF",
    long: "",
    tone: "/sound/dtmf-3.mp3",
  },
  {
    number: "4",
    value: "4",
    alt: "GHI",
    long: "",
    tone: "/sound/dtmf-4.mp3",
  },
  {
    number: "5",
    value: "5",
    alt: "JKL",
    long: "",
    tone: "/sound/dtmf-5.mp3",
  },
  {
    number: "6",
    value: "6",
    alt: "MNO",
    long: "",
    tone: "/sound/dtmf-6.mp3",
  },
  {
    number: "7",
    value: "7",
    alt: "PQRS",
    long: "",
    tone: "/sound/dtmf-7.mp3",
  },
  {
    number: "8",
    value: "8",
    alt: "TUV",
    long: "",
    tone: "/sound/dtmf-8.mp3",
  },
  {
    number: "9",
    value: "9",
    alt: "WXYZ",
    long: "",
    tone: "/sound/dtmf-9.mp3",
  },
  {
    number: "*",
    value: "*",
    alt: "",
    long: "",
    tone: "/sound/dtmf-star.mp3",
  },
  {
    number: "0",
    value: "0",
    alt: "+",
    long: "+",
    tone: "/sound/dtmf-0.mp3",
  },
  {
    number: "#",
    value: "#",
    alt: "",
    long: "",
    tone: "/sound/dtmf-hash.mp3",
  },
];
